import { evaluationTypeSchema } from "../schema/evaluation.schema.js";
import models from "../model/evaluation.model.js";
const { EvaluationType, StudentEvaluation } = models;
import Course from "../model/course.model.js";
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
    const course = await Course.findOne({ where: { ID_COURSE: ID_COURSE} });
    return course;
};

export const isValidUser = async (ID_USER) => {
    const user = await User.findOne({ where: { ID_USER: ID_USER} });
    return user;
};

export const createEvaluationLogic = async (req, res) => {
    try {
        const data = req.body;
        
        const hasAllFields = data.hasOwnProperty("ID_COURSE") &&
                            data.hasOwnProperty("WEIGHT") &&
                            data.hasOwnProperty("DSC_NAME") &&
                            data.hasOwnProperty("DATE_EVALUATION") &&
                            data.hasOwnProperty("ID_USER") &&
                            data.hasOwnProperty("SCORE_OBTAINED");

        if (!hasAllFields) {
            return res.status(400).json({
                message: "Faltan campos obligatorios para el registro completo"
            });
        }

        const course = await Course.findByPk(data.ID_COURSE);
        if (!course) {
            return res.status(400).json({ message: "El curso especificado no existe." });
        }

        const user = await User.findByPk(data.ID_USER);
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
                ID_USER: data.ID_USER
            }, { transaction: t });

            const newStudentEvaluation = await StudentEvaluation.create({
                ID_TYPE: newEvaluationType.ID_TYPE, // Usamos el ID recién creado
                SCORE_OBTAINED: data.SCORE_OBTAINED,
                DSC_COMMENT: data.DSC_COMMENT || null
            }, { transaction: t });

            return {
                evaluationType: newEvaluationType,
                studentEvaluation: newStudentEvaluation
            };
        });

        return res.status(201).json({
            message: "Evaluación registrada exitosamente en ambas tablas",
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
      
        const isEvaluationType = data.hasOwnProperty("ID_COURSE") &&
                                 data.hasOwnProperty("WEIGHT") &&
                                 data.hasOwnProperty("DSC_NAME") &&
                                 data.hasOwnProperty("DATE_EVALUATION") &&
                                 data.hasOwnProperty("ID_USER");

        const isStudentEvaluation = data.hasOwnProperty("ID_TYPE") &&
                                    data.hasOwnProperty("SCORE_OBTAINED");

        if (isEvaluationType) {
            const {
                ID_COURSE,
                DSC_NAME,
                WEIGHT,
                DATE_EVALUATION,
                DSC_EVALUATION,
                ID_USER
            } = data;

            const validation = validateUpdateEvaluationType(req);
            if (validation !== true) {
                return res.status(400).json({ message: validation });
            }

            const course = await Course.findByPk(ID_COURSE);
            if (!course) {
                return res.status(400).json({ message: "El curso especificado no existe." });
            }

            const user = await User.findByPk(ID_USER);
            if (!user) {
                return res.status(400).json({ message: "El usuario especificado no existe." });
            }

            const evaluation = await EvaluationType.findByPk(id);
            if (!evaluation) {
                return res.status(404).json({ message: "Tipo de evaluación no encontrado." });
            }

            await evaluation.update({
                ID_COURSE,
                DSC_NAME,
                WEIGHT,
                DATE_EVALUATION,
                DSC_EVALUATION,
                ID_USER
            });

            return res.status(200).json({
                message: "Tipo de evaluación actualizado exitosamente.",
                evaluation
            });
        }

        if (isStudentEvaluation) {
            const {
                ID_TYPE,
                SCORE_OBTAINED,
                DSC_COMMENT
            } = data;

            const evaluation = await StudentEvaluation.findByPk(id);
            if (!evaluation) {
                return res.status(404).json({ message: "Evaluación del estudiante no encontrada." });
            }

            await evaluation.update({
                ID_TYPE,
                SCORE_OBTAINED,
                DSC_COMMENT
            });

            return res.status(200).json({
                message: "Evaluación del estudiante actualizada exitosamente.",
                evaluation
            });
        }

        return res.status(400).json({ message: "Los datos proporcionados no coinciden con ningún formato conocido." });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getEvaluationsByUserID = async (req, res) => {
    try {
        const {
            page = 1,
            pageSize = 10,
            orderByField = 'DATE_EVALUATION',
            order = 'asc',
            userId,
        } = req.query;

        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        // Buscar usuario por número de identificación
        const user = await User.findOne({ where: { DSC_IDENTIFICATION: userId } });

        if (!user) {
            return res.status(400).json({ message: "El usuario con esa identificación no existe." });
        }

        const field = ['DATE_EVALUATION', 'DSC_NAME', 'WEIGHT'].includes(orderByField)
            ? orderByField
            : 'DATE_EVALUATION';

        const sortOrder = ['asc', 'desc'].includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';

        const { count, rows } = await EvaluationType.findAndCountAll({
            where: {
                ID_USER: user.ID_USER,
            },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [
                {
                    model: Course,
                    attributes: ['DSC_NAME', 'DSC_CODE'],
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

        if (rows.length === 0) {
            return res.status(204).json({ message: "No se encontraron evaluaciones para este usuario." });
        }

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            evaluations: rows,
        });

    } catch (error) {
        console.error("Error al obtener evaluaciones por ID de usuario:", error);
        return res.status(500).json({ message: error.message });
    }
};