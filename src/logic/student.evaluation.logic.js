import { studentEvaluationSchema } from "../schema/student.evaluation.schema.js";
import StudentEvaluation from "../model/student.evaluation.model.js";
import EvaluationType from "../model/evaluation.model.js";
import dbConnection from "../database/dbConnection.js";

const validateStudentEvaluationsFields = (studentEvaluationData) => {
    console.log("en la console", studentEvaluationData);
    const data = {
        ID_TYPE: Number(studentEvaluationData.ID_TYPE),
        SCORE_OBTAINED: Number(studentEvaluationData.SCORE_OBTAINED),
        DSC_COMMENT: studentEvaluationData.DSC_COMMENT,
    };

    const result = studentEvaluationSchema.safeParse(data);
    if (!result.success) {
        return result.error.errors.map(e => e.message).join(", ");
    }

    return null;
};

export const isValidEvaluationType = async (ID_TYPE) => {
    return await EvaluationType.findOne({ where: { ID_TYPE } });
};
export const createStudentEvaluationLogic = async (req, res) => {
    try {
        const data = req.body;

        const validationError = validateStudentEvaluationsFields(data);
        if (validationError) {
            return res.status(400).json({
                message: "Datos inválidos",
                error: validationError
            });
        }

        const evaluationType = await isValidEvaluationType(data.ID_TYPE);
        if (!evaluationType) {
            return res.status(404).json({
                message: `El tipo de evaluación con ID_TYPE ${data.ID_TYPE} no existe.`
            });
        }

        const result = await dbConnection.transaction(async (t) => {

            const existingEvaluation = await StudentEvaluation.findOne({
                where: { ID_TYPE: data.ID_TYPE },
                transaction: t
            });
            console.log("existingevaluation", existingEvaluation);
            if (existingEvaluation) {
                await existingEvaluation.destroy({ transaction: t });
            }

            const newStudentEvaluation = await StudentEvaluation.create({
                ID_TYPE: data.ID_TYPE,
                SCORE_OBTAINED: data.SCORE_OBTAINED,
                DSC_COMMENT: data.DSC_COMMENT
            }, { transaction: t });

            return { studentEvaluation: newStudentEvaluation };
        });

        return res.status(201).json({
            message: "Calificación registrada exitosamente.",
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al registrar la calificación.",
            error: error.message
        });
    }
};

export const updateStudentEvaluationLogic = async (req, res) => {
    try {
        const id = req.params.id; // ID_EVALUATION
        const data = req.body;

        const validationError = validateStudentEvaluationsFields(data);
        if (validationError) {
            return res.status(400).json({
                message: "Datos inválidos",
                error: validationError
            });
        }

        const evaluationType = await isValidEvaluationType(data.ID_TYPE);
        if (!evaluationType) {
            return res.status(404).json({
                message: `El tipo de evaluación con ID_TYPE ${data.ID_TYPE} no existe.`
            });
        }

        const existingEvaluation = await StudentEvaluation.findByPk(id);
        if (!existingEvaluation) {
            return res.status(404).json({
                message: `No se encontró ninguna evaluación con ID_EVALUATION ${id}.`
            });
        }

        await existingEvaluation.update({
            ID_TYPE: data.ID_TYPE,
            SCORE_OBTAINED: data.SCORE_OBTAINED,
            DSC_COMMENT: data.DSC_COMMENT
        });

        return res.status(200).json({
            message: "Evaluación actualizada exitosamente.",
            data: existingEvaluation
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar la evaluación.",
            error: error.message
        });
    }
};

export const deleteStudentEvaluationLogic = async (req, res) => {
    try {
        const id = req.params.id;

        const evaluation = await StudentEvaluation.findByPk(id);
        if (!evaluation) {
            return res.status(404).json({
                message: `No se encontró ninguna evaluación con ID_EVALUATION ${id}.`
            });
        }

        await evaluation.destroy();

        return res.status(200).json({
            message: "Evaluación eliminada exitosamente."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar la evaluación.",
            error: error.message
        });
    }
};