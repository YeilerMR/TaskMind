import { createNoteLogic, updateNoteLogic } from "../logic/notes.logic.js";
import Course from "../model/course.model.js";
import Notes from "../model/notes.model.js";
import User from "../model/user.model.js";
import { Op } from 'sequelize';
import Console from "../Lib/Console.js";
const logger = new Console("P_CONTROLLER");

function isNotEmpty(value) {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    } else if (typeof value === 'number') {
        return !isNaN(value);
    }
    return false;
}

async function isValidCourse(ID_COURSE) {
    if (!isNotEmpty(ID_COURSE)) return false;
    const course = await Course.findOne({ where: { ID_COURSE } });
    return !!course;
}

export const registerNote = async (req, res) => {
    try {
        const { ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT, DATE_NOTE } = req.body;

        const { error, note } = await createNoteLogic({
          ID_USER,
          ID_COURSE,
          DSC_TITLE,
          DSC_COMMENT,
          DATE_NOTE,
        });

        if (error) {
            logger.error(`Error al crear la nota: ${error}`);
            return res.status(400).json({ message: error });
        }

        res.json({
            status: 200,
            notes: note,
        });
    } catch (error) {
        logger.error(`Error inesperado al crear la nota: ${error.message}`);
        return res.status(500).json({ message: error.message });
    }
};

export const getAllNotes = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, orderByField = 'DSC_TITLE', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'DSC_TITLE' || orderByField === 'DSC_COMMENT' || orderByField === 'DSC_COMMENT'
        ) ? orderByField : 'DSC_TITLE';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const { count, rows } = await Notes.findAndCountAll({
           
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],
            include: [{
                model: User,
                attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_EMAIL','DSC_CAREER'],
            }],
            include: [{
              model: Course,
              attributes: ['DSC_NAME', 'ID_TEACHER', 'DSC_CODE'],
          }],
        });

        if (rows.length === 0) {
            const message = "No se encontraron notas.";
            logger.warning(message);
            return res.status(204).json({
                message: message,
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            courses: rows,
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const note = await Notes.findOne({
            where: { ID_STUDENT_NOTE: req.params.id },
        });
        console.log(note);
        if (!note) {
            const message = "nota no encontrada.";
            logger.error(message);
            return res.status(404).json({ message: message });
        }

        await note.update({
            STATUS: 0,
        });
        logger.success("Nota " + note.DSC_TITLE + " eliminada correctamente.")
        return res.json("Nota eliminada correctamente.");
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT, DATE_NOTE } = req.body;

        const { error, note } = await updateNoteLogic(req.params.id, {
          ID_USER,
          ID_COURSE,
          DSC_TITLE,
          DSC_COMMENT,
          DATE_NOTE,
        });

        if (error) {
            logger.error(`Error al actualizar la nota: ${error}`);
            return res.status(400).json({ message: error });
        }
        return res.json({ message: "Nota actualizada correctamente", course });
    } catch (error) {
        logger.error(`Error inesperado al actualizar la nota: ${error.message}`);
        return res.status(500).json({ message: error.message });
    }
};

export const searchNotes = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, termSearch = '', orderByField = 'DSC_TITLE', order = 'asc' } = req.query;
        if (!termSearch || typeof termSearch !== "string" || termSearch.trim() === "") {
            const message = "El término de búsqueda es obligatorio.";
            logger.warning(message);
            return res.status(400).json({ message });
        }
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'DSC_TITLE' || orderByField === 'DSC_COMMENT' || orderByField === 'DATE_NOTE'
        ) ? orderByField : 'DSC_TITLE';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const expectedMatch = { [Op.like]: `%${termSearch}%` };

        const { count, rows } = await Notes.findAndCountAll({
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],
            where: {
                [Op.or]: [
                    { DSC_TITLE: expectedMatch },
                    { DSC_COMMENT: expectedMatch },
                    { DATE_NOTE: expectedMatch },
                ],
            },
            include: [{
              model: User,
              attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_EMAIL','DSC_CAREER'],
          }],
          include: [{
            model: Course,
            attributes: ['DSC_NAME', 'ID_TEACHER', 'DSC_CODE'],
        }],
        });

        if (rows.length === 0) {
            const message = "No se encontraron notas con los criterios de búsqueda.";
            logger.warning(message);
            return res.status(204).json({
                message: message,
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            courses: rows,
        });
    } catch (error) {
        logger.error("Error al buscar la nota con los criterios de búsqueda." + error);
        return res.status(500).json({ message: error.message });
    }
};
