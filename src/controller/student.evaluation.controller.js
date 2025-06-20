import { createStudentEvaluationLogic, updateStudentEvaluationLogic, deleteStudentEvaluationLogic } from "../logic/student.evaluation.logic.js";

export const registerStudentEvaluation = async (req, res) => {
    try {
        createStudentEvaluationLogic(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStudentEvaluation = async (req, res) => {
    try {
        updateStudentEvaluationLogic(req, res);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteStudentEvaluation = async (req, res) => {
    try {
        deleteStudentEvaluationLogic(req, res);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};