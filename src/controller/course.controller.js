import { createCourseLogic, updateCourseLogic, deleteCourseLogic } from "../logic/course.logic.js";
import Course from "../model/course.model.js";
import Professor from "../model/professorModel.js";
import Notes from "../model/note.model.js";
import { Op } from 'sequelize';
import Console from "../Lib/Console.js";
const logger = new Console("P_CONTROLLER");

export const searchCourse = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, termSearch = '', orderByField = 'DSC_NAME', order = 'asc', userId } = req.query;
        if (!termSearch || typeof termSearch !== "string" || termSearch.trim() === "") {
            const message = "El término de búsqueda es obligatorio.";
            logger.warning(message);
            return res.status(400).json({ message });
        }
        if (!userId) {
            const message = "Se requiere el ID_USER.";
            logger.warning(message);
            return res.status(400).json({ message });
        }
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'DSC_NAME' || orderByField === 'DSC_CODE' || orderByField === 'DSC_ATTENTION'
        ) ? orderByField : 'DSC_NAME';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const expectedMatch = { [Op.like]: `%${termSearch}%` };

        const { count, rows } = await Course.findAndCountAll({
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],
            where: {
                ID_USER: userId,
                [Op.or]: [
                    { DSC_NAME: expectedMatch },
                    { DSC_CODE: expectedMatch },
                    { DSC_ATTENTION: expectedMatch },
                ],
            },
            include: [{
                model: Professor,
                attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_LAST_NAME_TWO'],
            }],
        });

        if (rows.length === 0) {
            const message = "No se encontraron cursos con los criterios de búsqueda.";
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
        logger.error("Error al buscar cursos con los criterios de búsqueda." + error);
        return res.status(500).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const {
            page = 1,
            pageSize = 10,
            orderByField = 'DSC_NAME',
            order = 'asc',
            userId,
        } = req.query;

        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        if (!userId) {
            return res.status(400).json({ message: "Se requiere el ID_USER." });
        }

        const field = ['DSC_NAME', 'DSC_CODE', 'DSC_ATTENTION'].includes(orderByField) ? orderByField : 'DSC_NAME';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const { count, rows } = await Course.findAndCountAll({
            where: {
                ID_USER: userId,
            },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [{
                model: Professor,
                attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_LAST_NAME_TWO'],
            }],
        });

        if (rows.length === 0) {
            const message = "No se encontraron cursos.";
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

export const registerCourse = async (req, res) => {
    try {
        const { DSC_NAME, ID_TEACHER, ID_USER, DSC_CODE, DSC_ATTENTION, DSC_COLOR } = req.body;

        const { error, success } = await createCourseLogic({
            DSC_NAME,
            ID_TEACHER,
            ID_USER,
            DSC_CODE,
            DSC_ATTENTION,
            DSC_COLOR,
        });

        if (error) {
            logger.error(`Error al crear el curso: ${error}`);
            return res.status(400).json({ message: error });
        }

        if (success) {
            const courseSaved = await Course.create({
                DSC_NAME,
                ID_TEACHER,
                ID_USER,
                DSC_CODE,
                DSC_ATTENTION,
                DSC_COLOR,
            });

            res.json({
                status: 200,
                course: courseSaved,
                message: "Curso creado exitosamente",
            });
        }

    } catch (error) {
        logger.error(`Error inesperado al crear el curso: ${error.message}`);
        return res.status(500).json({ message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { DSC_NAME, ID_TEACHER, ID_USER, DSC_CODE, DSC_ATTENTION, DSC_COLOR } = req.body;

        const { error, success } = await updateCourseLogic({
            DSC_NAME,
            ID_TEACHER,
            ID_USER,
            DSC_CODE,
            DSC_ATTENTION,
            DSC_COLOR,
        });

        if (error) {
            logger.error(`Error al actualizar el curso: ${error}`);
            return res.status(400).json({ message: error });
        }

        if (success) {
            const course = await Course.findOne({ where: { ID_COURSE: req.params.id } });

            if (!course) {
                return res.status(404).json({ message: "Curso no encontrado." });
            }

            await course.update({
                DSC_NAME,
                ID_TEACHER,
                DSC_CODE,
                DSC_ATTENTION,
                DSC_COLOR,
            });

            return res.json({ message: "Curso actualizado correctamente", course });
        }

    } catch (error) {
        logger.error(`Error inesperado al actualizar el curso: ${error.message}`);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const courseId = parseInt(req.params.id);
        if (isNaN(courseId) || courseId <= 0) {
            return res.status(400).json({ message: "ID de curso inválido." });
        }

        const { error, success, course } = await deleteCourseLogic(courseId);

        if (error) {
            logger.error(error);
            return res.status(404).json({ message: error });
        }

        if (success) {
            await Notes.destroy({ where: { ID_COURSE: courseId } });
            await course.destroy();

            const professorHasOtherCourses = await Course.count({ where: { ID_TEACHER: course.ID_TEACHER } });

            if (professorHasOtherCourses === 0) {
                await Professor.destroy({ where: { ID_TEACHER: course.ID_TEACHER } });
            }

            const message = "Curso eliminado correctamente.";
            logger.success(message);
            return res.json({ message });
        }

    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};