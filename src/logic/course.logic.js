import { courseSchema } from "../schema/course.schema.js";
import Professor from "../model/professorModel.js";
import Course from "../model/course.model.js";
import Notes from "../model/note.model.js";
import User from "../model/user.model.js";

// Function to check if the professor is valid
export const isValidProfessor = async (ID_TEACHER) => {
    const professor = await Professor.findOne({ where: { ID_TEACHER } });
    return !!professor;
};

// Function to check if the user is valid
export const isValidUser = async (ID_USER) => {
    const user = await User.findOne({ where: { ID_USER } });
    return !!user;
};

// Function to validate data types
export const validateCourse = (courseData) => {
    const validatedData = {
        DSC_NAME: courseData.DSC_NAME !== undefined ? String(courseData.DSC_NAME).trim() : null,
        ID_TEACHER: courseData.ID_TEACHER !== undefined ? Number(courseData.ID_TEACHER) : null,
        ID_USER: courseData.ID_USER !== undefined ? Number(courseData.ID_TEACHER) : null,
        DSC_CODE: courseData.DSC_CODE !== undefined ? String(courseData.DSC_CODE).trim() : null,
        DSC_ATTENTION: courseData.DSC_ATTENTION !== undefined ? String(courseData.DSC_ATTENTION).trim() : null,
        DSC_COLOR: courseData.DSC_COLOR !== undefined ? String(courseData.DSC_COLOR).trim() : null,
    };

    if (validatedData.DSC_NAME === null || validatedData.DSC_NAME === "") {
        return "El nombre del curso es obligatorio.";
    }
    if (validatedData.DSC_CODE === null || validatedData.DSC_CODE === "") {
        return "El código del curso es obligatorio.";
    }
    if (validatedData.ID_TEACHER === null) {
        return "El ID del profesor es obligatorio.";
    }
    if (validatedData.ID_USER === null) {
        return "El ID del usuario es obligatorio.";
    }
    if (validatedData.DSC_ATTENTION === null) {
        return "El campo de horario atención debe estar presente";
    }
    if (isNaN(validatedData.ID_TEACHER)) {
        return "El ID del profesor debe ser un valor numérico.";
    }

    const result = courseSchema.safeParse(validatedData);
    if (!result.success) {
        return result.error.errors.map(e => e.message).join(", ");
    }

    return null;
};

// Function to create a new course
export const createCourseLogic = async ({ DSC_NAME, ID_TEACHER, ID_USER, DSC_CODE, DSC_ATTENTION, DSC_COLOR }) => {

    const validationError = validateCourse({
        DSC_NAME,
        ID_TEACHER,
        ID_USER,
        DSC_CODE,
        DSC_ATTENTION,
        DSC_COLOR,
    });

    if (validationError) {
        return { error: validationError };
    }

    const isProfessorValid = await isValidProfessor(ID_TEACHER);
    if (!isProfessorValid) {
        return { error: "El profesor no existe o el ID es inválido." };
    }

    const isValidUser = await isValidUser(ID_USER);
    if (!isValidUser) {
        return { error: "El usuario no existe o el ID es inválido." };
    }

    return { success: true };
};

// Function to update an existing course
export const updateCourseLogic = async ({ DSC_NAME, ID_TEACHER, ID_USER, DSC_CODE, DSC_ATTENTION, DSC_COLOR }) => {
    console.log(DSC_NAME, ID_TEACHER, DSC_CODE, DSC_ATTENTION, DSC_COLOR);

    const validationError = validateCourse({
        DSC_NAME,
        ID_TEACHER,
        ID_USER,
        DSC_CODE,
        DSC_ATTENTION,
        DSC_COLOR,
    });

    if (validationError) {
        return { error: validationError };
    }

    const isProfessorValid = await isValidProfessor(ID_TEACHER);
    if (!isProfessorValid) {
        return { error: "El profesor no existe o el ID es inválido." };
    }

    return { success: true };
};

// Function to delete an existing course
export const deleteCourseLogic = async (courseId) => {
    try {
        const course = await Course.findOne({ where: { ID_COURSE: courseId } });

        if (!course) {
            return { error: "Curso no encontrado." };
        }

        return { success: true, course };
    } catch (error) {
        return { error: error.message };
    }
};