import { createNoteLogic, updateNoteLogic } from "../logic/notes.logic.js";
import Course from "../model/course.model.js";
import Notes from "../model/note.model.js";
import User from "../model/user.model.js";
import { Op } from 'sequelize';
import Console from "../Lib/Console.js";
import {getDateCR} from "../Lib/date.js";

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
        const { ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT } = req.body;
        const DATE_NOTE = await getDateCR();
        const userObj = await User.findOne({where:{ID_USER: ID_USER}});

        if(!userObj){
            return res.status(404).json({message: "El ID usuario no existe"});
        }

        const courseObj =await Course.findOne({where:{ID_COURSE: ID_COURSE}});
        if(!courseObj){
            return res.status(404).json({message: "El ID del curso no existe"});
        }

        const newNote = new Notes({
            ID_USER, 
            ID_COURSE,
             DSC_TITLE, 
             DSC_COMMENT,
             DATE_NOTE
            });

            const noteSaved = await newNote.save();
        if(noteSaved){
            res.status(200).json({
                ID_STUDENT_NOTE: noteSaved.ID_STUDENT_NOTE,
                ID_USER: noteSaved.ID_USER,
                ID_COURSE: noteSaved.ID_COURSE,
                DSC_TITLE:noteSaved.DSC_TITLE,
                DSC_COMMENT: noteSaved.DSC_COMMENT,
                DATE_NOTE: noteSaved.DATE_NOTE,
                message: 'Registro realizado correctamente.',
              });

        }
        
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
            orderByField === 'DSC_TITLE' || orderByField === 'DSC_COMMENT'
        ) ? orderByField : 'DSC_TITLE';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const { count, rows } = await Notes.findAndCountAll({
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],
            include: [
                {
                    model: User,
                    attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_EMAIL','DSC_CAREER'],
                },
                {
                    model: Course,
                    attributes: ['DSC_NAME', 'ID_TEACHER', 'DSC_CODE'],
                }
            ],
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
        // Search note by ID
        const note = await Notes.findOne({
            where: { ID_STUDENT_NOTE: req.params.id },
        });

        // Verify if the note exist
        if (!note) {
            const message = "Nota no encontrada.";
            logger.error(message);
            return res.status(404).json({ message });
        }

        // Delete note from db
        await note.destroy();

        // Log and success respond
        logger.success(`Nota "${note.DSC_TITLE}" (ID: ${note.ID_STUDENT_NOTE}) eliminada permanentemente.`);
        return res.json({ 
            success: true,
            message: "Nota eliminada permanentemente de la base de datos.",
            deletedNote: {
                id: note.ID_STUDENT_NOTE,
                title: note.DSC_TITLE
            }
        });
    } catch (error) {
        logger.error(`Error al eliminar nota: ${error.message}`);
        return res.status(500).json({ 
            success: false,
            message: "Error al eliminar la nota",
            error: error.message 
        });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT, DATE_NOTE } = req.body;

        const noteObj = await Notes.findOne({ where: { ID_STUDENT_NOTE: req.params.id } });

        if (!noteObj) {
            return res.status(404).json({ message: "Error al cargar la nota." });
          }

          await noteObj.update({
            ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT,DATE_NOTE,
          });

          return res.status(200).json({ message: "Nota actualizada correctamente" });
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

export const getNotesByUserID = async (req, res) => {
    try {
        const {
            page = 1,
            pageSize = 10,
            orderByField = 'ID_COURSE',
            order = 'asc',
            userId,
        } = req.query;

        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const user = await User.findOne({ where: { DSC_IDENTIFICATION: userId } });

        if (!user) {
            return res.status(400).json({ message: "Se requiere el ID_USER." });
        }

        const field = ['ID_COURSE', 'DSC_TITLE', 'DSC_COMMENT'].includes(orderByField) ? orderByField : 'ID_COURSE';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const { count, rows } = await Notes.findAndCountAll({
            where: {
                ID_USER: user.ID_USER,
            },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [{
                model: Course,
                attributes: ['DSC_NAME', 'DSC_CODE', 'DSC_ATTENTION'],
            }],
        });

        if (rows.length === 0) {
            const message = "No se encontraron notas.";
            logger.warning(message);
            return res.status(204).json({ message });
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