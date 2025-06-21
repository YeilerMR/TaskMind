import { courseSchema } from "../schema/course.schema.js";
import Professor from "../model/professorModel.js";
import Course from "../model/course.model.js";
import Notes from "../model/note.model.js";
import User from "../model/user.model.js";
import EvaluationType from "../model/evaluation.model.js";
import { format } from 'date-fns';
import { Op } from "sequelize";

// Validations
const validateCourse = (courseData) => {
    const data = {
        DSC_NAME: String(courseData.DSC_NAME ?? "").trim(),
        ID_TEACHER: Number(courseData.ID_TEACHER),
        ID_USER: Number(courseData.ID_USER),
        DSC_CODE: String(courseData.DSC_CODE ?? "").trim(),
        DSC_ATTENTION: String(courseData.DSC_ATTENTION ?? "").trim(),
        DSC_COLOR: String(courseData.DSC_COLOR ?? "").trim(),
    };
    const result = courseSchema.safeParse(data);
    if (!result.success) {
        return result.error.errors.map(e => e.message).join(", ");
    }

    return null;
};

const isValidProfessor = async (ID_TEACHER) => !!await Professor.findByPk(ID_TEACHER);
const isValidUser = async (ID_USER) => !!await User.findByPk(ID_USER);

// Create Course Logic
export const createCourseLogic = async (data) => {
    const error = validateCourse(data);
    if (error) return { error };

    const user = await User.findOne({
        where: { DSC_IDENTIFICATION: data.ID_USER },
        attributes: ['ID_USER'],
    });

    if (!user) return { error: "Usuario no encontrado con esa cédula." };

    const professorExists = await isValidProfessor(data.ID_TEACHER);
    if (!professorExists) return { error: "El profesor no existe o el ID es inválido." };


    data.ID_USER = user.ID_USER;

    const isUserValid = await isValidUser(data.ID_USER);
    if (!isUserValid) {
        return { error: "El usuario no existe o el ID es inválido." };
    }


    const course = await Course.create(data);
    return { success: true, course };
};

// Update Course Logic
export const updateCourseLogic = async (id, data) => {
    const error = validateCourse(data);
    if (error) return { error };

    const user = await User.findOne({
        where: { DSC_IDENTIFICATION: data.ID_USER },
        attributes: ['ID_USER'],
    });
    
    if (!user) return { error: "Usuario no encontrado con esa cédula." };

    const professorExists = await isValidProfessor(data.ID_TEACHER);
    if (!professorExists) return { error: "El profesor no existe o el ID es inválido." };

    data.ID_USER = user.ID_USER;

    const [updatedRows] = await Course.update(data, {
        where: { ID_COURSE: id }
    });

    if (updatedRows === 0) {
        return { error: "No se encontró el curso para actualizar." };
    }

    const updatedCourse = await Course.findByPk(id);

    return { success: true, course: updatedCourse };
};

// Delete Course Logic
export const deleteCourseLogic = async (id) => {
    const course = await Course.findByPk(id);
    if (!course) return { error: "Curso no encontrado." };

    await Notes.destroy({ where: { ID_COURSE: id } });
    await course.destroy();

    const otherCourses = await Course.count({ where: { ID_TEACHER: course.ID_TEACHER } });
    if (otherCourses === 0) {
        await Professor.destroy({ where: { ID_TEACHER: course.ID_TEACHER } });
    }

    return { success: true };
};

// Search Courses Logic
export const searchCoursesLogic = async ({ page, pageSize, termSearch, orderByField, order, userId }) => {
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;
    const field = ['DSC_NAME', 'DSC_CODE', 'DSC_ATTENTION'].includes(orderByField) ? orderByField : 'DSC_NAME';
    const sortOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const { count, rows } = await Course.findAndCountAll({
        limit,
        offset,
        order: [[field, sortOrder]],
        where: {
            ID_USER: userId,
            [Op.or]: [
                { DSC_NAME: { [Op.like]: `%${termSearch}%` } },
                { DSC_CODE: { [Op.like]: `%${termSearch}%` } },
                { DSC_ATTENTION: { [Op.like]: `%${termSearch}%` } },
            ]
        },
        include: [{
            model: Professor,
            attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_LAST_NAME_TWO'],
        },
        
    ]
    });

    return { total: count, courses: rows };
};

// Get All Courses Logic
export const getAllCoursesLogic = async ({ page, pageSize, userId, orderByField, order }) => {
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const user = await User.findOne({
        where: { DSC_IDENTIFICATION: userId },
        attributes: ['ID_USER'],
    });

    if (!user) return { error: "Usuario no encontrado con esa cédula." };
    const today = format(new Date(), 'yyyy-MM-dd'); 
    const field = ['DSC_NAME', 'DSC_CODE', 'DSC_ATTENTION'].includes(orderByField) ? orderByField : 'DSC_NAME';
    const sortOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const { count, rows } = await Course.findAndCountAll({
        where: { ID_USER: user.ID_USER },
        limit,
        offset,
        order: [[field, sortOrder]],
        include: [{
            model: Professor,
            attributes: ['DSC_FIRST_NAME', 'DSC_LAST_NAME_ONE', 'DSC_LAST_NAME_TWO', 'DSC_EMAIL', 'DSC_PHONE'],
        },
        {
            model: EvaluationType,
            where: {
                DATE_EVALUATION: {
                    [Op.gte]:today
                }
            },
            required: false,
            order: [['DATE_EVALUATION', 'ASC']]
        }

    ],
    });

    console.log(rows)

    const filteredCourses = rows.map(course => {
        const evaluations = course.EvaluationTypes || [];
    
        // Ordenar las evaluaciones por fecha ascendente
        const sortedEvals = evaluations.sort((a, b) =>
            new Date(a.DATE_EVALUATION) - new Date(b.DATE_EVALUATION)
        );
    
        const nextEvaluation = sortedEvals.length > 0 ? sortedEvals : null;
    
        const courseData = course.toJSON();
        delete courseData.EvaluationTypes;
    
        return {
            ...courseData,
            EvaluationType: nextEvaluation 
        };
    });
    

return {
    total: count,
    courses: filteredCourses
};
};