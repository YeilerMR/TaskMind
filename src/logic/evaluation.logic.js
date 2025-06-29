import { evaluationTypeSchema } from "../schema/evaluation.schema.js";
import EvaluationType from "../model/evaluation.model.js";
import StudentEvaluation from "../model/student.evaluation.model.js"
import Course from "../model/course.model.js";
import Professor from "../model/professorModel.js";
import User from "../model/user.model.js";
import { DOUBLE, Op } from "sequelize";
import dbConnection from "../database/dbConnection.js";

// Validations
const validateEvaluation = (evaluationData) => {
    const data = {
        ID_COURSE: Number(evaluationData.ID_COURSE),
        DSC_NAME: String(evaluationData.DSC_NAME ?? "").trim(),
        WEIGHT: parseFloat(evaluationData.WEIGHT ?? 0.0),
        DATE_EVALUATION: String(evaluationData.DATE_EVALUATION ?? "").trim(),
        DSC_EVALUATION: String(evaluationData.DSC_EVALUATION ?? "").trim(),
        ID_USER: Number(evaluationData.ID_USER),
        ID_TYPE: Number(evaluationData.ID_TYPE),
        SCORE_OBTAINED: DOUBLE(evaluationData.SCORE_OBTAINED ?? 0.0),
        DSC_COMMENT: String(evaluationData.DSC_COMMENT ?? "").trim(),

    };
    const result = evaluationTypeSchema.safeParse(data);
    if (!result.success) {
        return result.error.errors.map(e => e.message).join(", ");
    }

    return null;
};

export const isValidCourse = async (ID_COURSE) => {
    const course = await Course.findOne({ where: { ID_COURSE: ID_COURSE } });
    return course;
};

export const isValidUser = async (ID_USER) => {
    const user = await User.findOne({ where: { ID_USER: ID_USER } });
    return user;
};

export const createEvaluationLogic = async (req, res) => {
    try {
        const data = req.body;

        const hasAllFields = data.hasOwnProperty("ID_COURSE") &&
            data.hasOwnProperty("WEIGHT") &&
            data.hasOwnProperty("DSC_NAME") &&
            data.hasOwnProperty("DATE_EVALUATION") &&
            data.hasOwnProperty("ID_USER");

        if (!hasAllFields) {
            return res.status(400).json({
                message: "Faltan campos obligatorios para el registro completo"
            });
        }

        const course = await Course.findByPk(data.ID_COURSE);
        if (!course) {
            return res.status(400).json({ message: "El curso especificado no existe." });
        }

        const user = await User.findOne({
            where: { DSC_IDENTIFICATION: data.ID_USER }
        });
        if (!user) {
            return res.status(400).json({ message: "El usuario especificado no existe." });
        }

        const result = await dbConnection.transaction(async (t) => {

            const newEvaluationType = await EvaluationType.create({
                ID_COURSE: data.ID_COURSE,
                DSC_NAME: data.DSC_NAME,
                WEIGHT: data.WEIGHT,
                DATE_EVALUATION: data.DATE_EVALUATION,
                DSC_EVALUATION: data.DSC_EVALUATION || null,
                ID_USER: user.ID_USER
            }, { transaction: t });

            return {
                evaluationType: newEvaluationType,
            };
        });

        return res.status(201).json({
            message: "Evaluación registrada exitosamente",
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al registrar evaluación",
            error: error.message
        });
    }
};

export const updateEvaluationLogic = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        console.log("DATA RECIBIDA: ", req.params, req.body);

        const hasEvaluationTypeFields = 
            data.hasOwnProperty("ID_COURSE") ||
            data.hasOwnProperty("WEIGHT") ||
            data.hasOwnProperty("DSC_NAME") ||
            data.hasOwnProperty("DATE_EVALUATION") ||
            data.hasOwnProperty("ID_USER");

        const result = await dbConnection.transaction(async (t) => {
            const results = {};

            if (hasEvaluationTypeFields) {
                const evaluationType = await EvaluationType.findByPk(id, { transaction: t });
                if (!evaluationType) {
                    throw new Error("Tipo de evaluación no encontrado");
                }

                if (data.ID_COURSE) {
                    const course = await Course.findByPk(data.ID_COURSE, { transaction: t });
                    if (!course) throw new Error("El curso especificado no existe");
                }

                if (data.ID_USER !== undefined) {
                    const user = await User.findOne({
                        where: { DSC_IDENTIFICATION: data.ID_USER },
                        attributes: ['ID_USER'],
                        transaction: t
                    });
                    
                    if (!user) {
                        throw new Error("El usuario especificado no existe");
                    }
                
                    data.ID_USER = user.ID_USER;
                }                

                await evaluationType.update({
                    ID_COURSE: data.ID_COURSE || evaluationType.ID_COURSE,
                    DSC_NAME: data.DSC_NAME || evaluationType.DSC_NAME,
                    WEIGHT: data.WEIGHT || evaluationType.WEIGHT,
                    DATE_EVALUATION: data.DATE_EVALUATION || evaluationType.DATE_EVALUATION,
                    DSC_EVALUATION: data.DSC_EVALUATION !== undefined ? data.DSC_EVALUATION : evaluationType.DSC_EVALUATION,
                    ID_USER: data.ID_USER || evaluationType.ID_USER
                }, { transaction: t });

                results.evaluationType = evaluationType;
            }

            return results;
        });

        let message = "";
        if (result.evaluationType) {
            message = "Evaluación completa actualizada exitosamente";
        } else if (result.evaluationType) {
            message = "Tipo de evaluación actualizado exitosamente";
        }

        return res.status(200).json({
            message,
            ...result
        });

    } catch (error) {
        console.error("ERROR AL ACTUALIZAR EVALUACIÓN:", error);  // <- Añade esto
        return res.status(500).json({
            message: "Error al actualizar evaluación",
            error: error.message
        });
    }    
};

export const getEvaluationsByUserID = async (req, res) => {
    try {
        const {
            orderByField = 'DATE_EVALUATION',
            order = 'asc',
            userId,
        } = req.query;

        const user = await User.findOne({ where: { DSC_IDENTIFICATION: userId } });

        if (!user) {
            return res.status(400).json({ message: "El usuario con esa identificación no existe." });
        }

        const field = ['DATE_EVALUATION', 'DSC_NAME', 'WEIGHT'].includes(orderByField)
            ? orderByField
            : 'DATE_EVALUATION';

        const sortOrder = ['asc', 'desc'].includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';

        const evaluations = await EvaluationType.findAll({
            where: {
                ID_USER: user.ID_USER,
            },
            order: [[field, sortOrder]],
            include: [
                {
                    model: Course,
                    include: [{
                        model: Professor,
                        attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_LAST_NAME_TWO', 'DSC_EMAIL', 'DSC_PHONE'],
                    }]
                },
                {
                    model: StudentEvaluation,
                    attributes: ['SCORE_OBTAINED', 'DSC_COMMENT'],
                },
                {
                    model: User,
                    attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE'],
                }
            ],
        });

        if (evaluations.length === 0) {
            return res.status(204).json({ message: "No se encontraron evaluaciones para este usuario." });
        }

        return res.status(200).json({
            total: evaluations.length,
            evaluations: evaluations,
        });

    } catch (error) {
        console.error("Error al obtener evaluaciones por ID de usuario:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteEvaluationLogic = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await dbConnection.transaction(async (t) => {

            const deletedStudentEvaluations = await StudentEvaluation.destroy({
                where: { ID_TYPE: id },
                transaction: t
            });

            const deletedEvaluationType = await EvaluationType.destroy({
                where: { ID_TYPE: id },
                transaction: t
            });

            if (deletedEvaluationType === 0) {
                throw new Error("No se encontró el tipo de evaluación a eliminar");
            }

            return {
                deletedEvaluationType,
                deletedStudentEvaluations
            };
        });

        return res.status(200).json({
            message: "Evaluación eliminada completamente",
            details: {
                evaluationTypeDeleted: result.deletedEvaluationType,
                studentEvaluationsDeleted: result.deletedStudentEvaluations
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar la evaluación",
            error: error.message
        });
    }
};