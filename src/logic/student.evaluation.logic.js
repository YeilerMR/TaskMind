import { studentEvaluationSchema } from "../schema/student.evaluation.schema";
import StudentEvaluation from "../model/student.evaluation.model.js"
import { Op } from "sequelize";
import dbConnection from "../database/dbConnection.js";

// Crear evaluación del estudiante
export const createStudentEvaluationLogic = async (req, res) => {
    try {
        const data = req.body;

        if (!data.ID_TYPE || data.SCORE_OBTAINED == null) {
            return res.status(400).json({
                message: "ID_TYPE y SCORE_OBTAINED son campos obligatorios."
            });
        }

        const evaluation = await EvaluationType.findByPk(data.ID_TYPE);
        if (!evaluation) {
            return res.status(404).json({
                message: "El tipo de evaluación especificado no existe."
            });
        }

        const newStudentEvaluation = await StudentEvaluation.create({
            ID_TYPE: data.ID_TYPE,
            SCORE_OBTAINED: data.SCORE_OBTAINED,
            DSC_COMMENT: data.DSC_COMMENT || null
        });

        return res.status(201).json({
            message: "Evaluación del estudiante creada correctamente",
            data: newStudentEvaluation
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al registrar evaluación del estudiante",
            error: error.message
        });
    }
};

// Actualizar evaluación del estudiante
export const updateStudentEvaluationLogic = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const studentEval = await StudentEvaluation.findByPk(id);
        if (!studentEval) {
            return res.status(404).json({ message: "Evaluación del estudiante no encontrada." });
        }

        await studentEval.update({
            SCORE_OBTAINED: data.SCORE_OBTAINED ?? studentEval.SCORE_OBTAINED,
            DSC_COMMENT: data.DSC_COMMENT ?? studentEval.DSC_COMMENT
        });

        return res.status(200).json({
            message: "Evaluación del estudiante actualizada correctamente",
            data: studentEval
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar evaluación del estudiante",
            error: error.message
        });
    }
};

// Obtener evaluaciones de estudiantes por tipo de evaluación
export const getStudentEvaluationsByType = async (req, res) => {
    try {
        const { typeId } = req.params;

        const evaluations = await StudentEvaluation.findAll({
            where: { ID_TYPE: typeId }
        });

        if (!evaluations.length) {
            return res.status(204).json({ message: "No hay evaluaciones de estudiantes para este tipo." });
        }

        return res.status(200).json({
            total: evaluations.length,
            evaluations
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener evaluaciones de estudiantes",
            error: error.message
        });
    }
};

// Eliminar evaluación individual
export const deleteStudentEvaluationLogic = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await StudentEvaluation.destroy({
            where: { ID_EVALUATION: id }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: "Evaluación no encontrada" });
        }

        return res.status(200).json({ message: "Evaluación eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar evaluación",
            error: error.message
        });
    }
};