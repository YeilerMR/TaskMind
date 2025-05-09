import {
    createCourseLogic,
    updateCourseLogic,
    deleteCourseLogic,
    searchCoursesLogic,
    getAllCoursesLogic
} from "../logic/course.logic.js";

import Console from "../Lib/Console.js";
const logger = new Console("P_CONTROLLER");

export const registerCourse = async (req, res) => {
    try {
        const { error, success, course } = await createCourseLogic(req.body);

        if (error) return res.status(400).json({ message: error });

        res.json({ status: 200, course, message: "Curso creado exitosamente" });
    } catch (error) {
        logger.error("Error al registrar curso: " + error.message);
        res.status(500).json({ message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, success, course } = await updateCourseLogic(id, req.body);

        if (error) return res.status(400).json({ message: error });

        res.json({ message: "Curso actualizado correctamente", course });
    } catch (error) {
        logger.error("Error al actualizar curso: " + error.message);
        res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) return res.status(400).json({ message: "ID de curso inválido." });

        const { error, success } = await deleteCourseLogic(id);

        if (error) return res.status(404).json({ message: error });

        res.json({ message: "Curso eliminado correctamente." });
    } catch (error) {
        logger.error("Error al eliminar curso: " + error.message);
        res.status(500).json({ message: error.message });
    }
};

export const searchCourse = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, termSearch = '', orderByField = 'DSC_NAME', order = 'asc', userId } = req.query;

        if (!termSearch.trim()) return res.status(400).json({ message: "El término de búsqueda es obligatorio." });
        if (!userId) return res.status(400).json({ message: "Se requiere el ID_USER." });

        const { total, courses } = await searchCoursesLogic({ page, pageSize, termSearch, orderByField, order, userId });

        if (courses.length === 0) return res.status(204).json({ message: "No se encontraron cursos." });

        res.json({
            total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: parseInt(page),
            pageSize: parseInt(pageSize),
            courses,
        });
    } catch (error) {
        logger.error("Error al buscar cursos: " + error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, orderByField = 'DSC_NAME', order = 'asc', userId } = req.query;

        if (!userId) return res.status(400).json({ message: "Se requiere el ID_USER (cédula)." });

        const result = await getAllCoursesLogic({ page, pageSize, orderByField, order, userId });

        if (result.error) return res.status(404).json({ message: result.error });
        if (result.courses.length === 0) return res.status(204).json({ message: "No se encontraron cursos." });

        res.json({
            total: result.total,
            totalPages: Math.ceil(result.total / pageSize),
            currentPage: parseInt(page),
            pageSize: parseInt(pageSize),
            courses: result.courses,
        });
    } catch (error) {
        logger.error("Error al obtener todos los cursos: " + error.message);
        res.status(500).json({ message: error.message });
    }
};
