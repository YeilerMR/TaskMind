import Course from "../model/course.model.js";
import Professor from "../model/professorModel.js";
import { Op } from 'sequelize';

function isNotEmpty(value) {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    } else if (typeof value === 'number') {
        return !isNaN(value);
    }
    return false;
}

async function isValidProfessor(ID_TEACHER) {
    if (!isNotEmpty(ID_TEACHER)) return false;
    const professor = await Professor.findOne({ where: { ID_TEACHER } });
    return !!professor;
}

export const registerCourse = async (req, res) => {
    try {
        const { DSC_NAME, ID_TEACHER, DSC_CODE, DSC_ATTENTION, DSC_COLOR, STATUS } = req.body;

        if (!isNotEmpty(DSC_NAME)) {
            return res.status(400).json({
                message: "El nombre del curso no es válido.",
            });
        }

        if (!(await isValidProfessor(ID_TEACHER))) {
            return res.status(400).json({ message: "El profesor no existe o el ID es inválido." });
        }

        const courseSaved = await Course.create({
            DSC_NAME,
            ID_TEACHER,
            DSC_CODE,
            DSC_ATTENTION,
            DSC_COLOR,
            STATUS,
        });

        res.json({
            status: 200,
            course: courseSaved,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, orderByField = 'DSC_NAME', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'DSC_NAME' || orderByField === 'DSC_CODE' || orderByField === 'DSC_ATTENTION'
        ) ? orderByField : 'DSC_NAME';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const { count, rows } = await Course.findAndCountAll({
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],
            include: [{
                model: Professor,
                attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_LAST_NAME_TWO'],
            }],
        });

        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron cursos.",
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
        return res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOne({
            where: { ID_COURSE: req.params.id },
        });
        console.log(course);
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado." });
        }

        await course.update({
            STATUS: 0,
        });

        return res.json("Curso eliminado correctamente.");
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { DSC_NAME, ID_TEACHER, DSC_CODE, DSC_ATTENTION, DSC_COLOR, STATUS } = req.body;

        console.log(req.body);

        const course = await Course.findOne({ where: { ID_COURSE: req.params.id } });

        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado." });
        }

        if (!(await isValidProfessor(ID_TEACHER))) {
            return res.status(400).json({ message: "El profesor no existe o el ID es inválido." });
        }

        const updatedData = {
            DSC_NAME,
            ID_TEACHER,
            DSC_CODE,
            DSC_ATTENTION,
            DSC_COLOR,
            STATUS,
        };

        await course.update(updatedData);

        return res.json(course);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const searchCourse = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, termSearch = '', orderByField = 'DSC_NAME', order = 'asc' } = req.query;
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
            return res.status(204).json({
                message: "No se encontraron cursos.",
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
        return res.status(500).json({ message: error.message });
    }
};
