import { courseSchema } from "../schema/course.schema.js";
import Professor from "../model/professorModel.js";
import Course from "../model/course.model.js";

// Función para verificar si el profesor es válido
export const isValidProfessor = async (ID_TEACHER) => {
    const professor = await Professor.findOne({ where: { ID_TEACHER } });
    return !!professor;
};

// Función para validar el tipo de datos
export const validateCourse = (courseData) => {
    const validatedData = {
        DSC_NAME: courseData.DSC_NAME !== undefined ? String(courseData.DSC_NAME).trim() : null,
        ID_TEACHER: courseData.ID_TEACHER !== undefined ? Number(courseData.ID_TEACHER) : null,
        DSC_CODE: courseData.DSC_CODE !== undefined ? String(courseData.DSC_CODE).trim() : null,
        DSC_ATTENTION: courseData.DSC_ATTENTION !== undefined ? String(courseData.DSC_ATTENTION).trim() : null,
        DSC_COLOR: courseData.DSC_COLOR !== undefined ? String(courseData.DSC_COLOR).trim() : null,
        STATUS: courseData.STATUS !== undefined ? Number(courseData.STATUS) : null,
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

    if(validatedData.DSC_ATTENTION === null){
        return "El campo de horario atención debe estar presente";
    }

    if (validatedData.STATUS === null) {
        return "El estado es obligatorio.";
    }
    if (validatedData.DSC_COLOR === null || validatedData.DSC_COLOR === "") {
        return "El color es obligatorio.";
    }

    if (isNaN(validatedData.ID_TEACHER)) {
        return "El ID del profesor debe ser un valor numérico.";
    } else if (isNaN(validatedData.STATUS)) {
        return "El estado debe ser un valor numérico.";
    }

    const result = courseSchema.safeParse(validatedData);
    if (!result.success) {
        return result.error.errors.map(e => e.message).join(", ");
    }

    return null;
};

// Función para crear un nuevo curso
export const createCourseLogic = async ({ DSC_NAME, ID_TEACHER, DSC_CODE, DSC_ATTENTION, DSC_COLOR }) => {

    const validationError = validateCourse({
        DSC_NAME,
        ID_TEACHER,
        DSC_CODE,
        DSC_ATTENTION,
        DSC_COLOR,
        STATUS: 1,
    });

    if (validationError) {
        return { error: validationError };
    }

    const isProfessorValid = await isValidProfessor(ID_TEACHER);
    if (!isProfessorValid) {
        return { error: "El profesor no existe o el ID es inválido." };
    }

    const courseSaved = await Course.create({
        DSC_NAME,
        ID_TEACHER,
        DSC_CODE,
        DSC_ATTENTION,
        DSC_COLOR,
        STATUS: 1,
    });

    return { course: courseSaved };
};

// Función para actualizar un curso
export const updateCourseLogic = async (courseId, { DSC_NAME, ID_TEACHER, DSC_CODE, DSC_ATTENTION, DSC_COLOR, STATUS }) => {
    console.log(DSC_NAME, ID_TEACHER, DSC_CODE, DSC_ATTENTION, DSC_COLOR, STATUS);
    const validationError = validateCourse({
        DSC_NAME,
        ID_TEACHER,
        DSC_CODE,
        DSC_ATTENTION,
        DSC_COLOR,
        STATUS,
    });

    if (validationError) {
        return { error: validationError };
    }

    const isProfessorValid = await isValidProfessor(ID_TEACHER);
    if (!isProfessorValid) {
        return { error: "El profesor no existe o el ID es inválido." };
    }

    const course = await Course.findOne({ where: { ID_COURSE: courseId } });
    if (!course) {
        return { error: "Curso no encontrado." };
    }

    await course.update({
        DSC_NAME,
        ID_TEACHER,
        DSC_CODE,
        DSC_ATTENTION,
        DSC_COLOR,
        STATUS,
    });

    return { course };
};