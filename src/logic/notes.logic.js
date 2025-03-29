import { noteSchema } from "../schema/notes.schema.js";
import Notes from "../model/notes.model.js";
import User from "../model/user.model.js";
import Course from "../model/course.model.js";

// Función para verificar si el profesor es válido
export const isValidUser = async (ID_USER) => {
    const user = await User.findOne({ where: { ID_USER } });
    return !!user;
};

export const isValidCourse = async (ID_COURSE) => {
    const course = await Course.findOne({ where: { ID_COURSE } });
    return !!course;
};

// Función para validar el tipo de datos
export const validateNote = (noteData) => {
    const validatedData = {
        ID_USER: noteData.ID_USER !== undefined ? Number(noteData.ID_USER) : null,
        ID_COURSE: noteData.ID_COURSE !== undefined ? Number(noteData.ID_COURSE) : null,
        DSC_TITLE: noteData.DSC_TITLE !== undefined ? String(noteData.DSC_TITLE).trim() : null,
        DSC_COMMENT: noteData.DSC_COMMENT !== undefined ? String(noteData.DSC_COMMENT).trim() : null,
        DATE_NOTE: noteData.DATE_NOTE !== undefined ? Date(noteData.DATE_NOTE) : null,
      
    };

    if (validatedData.ID_USER === null || validatedData.ID_USER === "") {
        return "El ID del usuario es obligatorio.";
    }
    if (validatedData.ID_COURSE === null || validatedData.ID_COURSE === "") {
        return "El ID del curso es obligatorio.";
    }
    if (validatedData.DSC_TITLE === null || validatedData.DSC_TITLE === "") {
        return "El titulo de la nota es obligatoria.";
    }

    if (validatedData.DATE_NOTE === null || validatedData.DATE_NOTE === "") {
        return "La fecha de la nota es obligatorio.";
    }
    

    if (isNaN(validatedData.ID_USER)) {
        return "El ID del usuario debe ser un valor numérico.";
    } else if (isNaN(validatedData.ID_COURSE)) {
        return "El ID del curso debe ser un valor numérico.";
    }

    const result = noteSchema.safeParse(validatedData);
    if (!result.success) {
        return result.error.errors.map(e => e.message).join(", ");
    }

    return null;
};

// Función para crear un nuevo curso
export const createNoteLogic = async ({ ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT, DATE_NOTE }) => {

    const validationError = validateNote({
        ID_USER,
        ID_COURSE,
        DSC_TITLE,
        DSC_COMMENT,
        DATE_NOTE,
    });

    if (validationError) {
        return { error: validationError };
    }

    const isUserValid = await isValidUser(ID_USER);
    if (!isUserValid) {
        return { error: "El usuario no existe o el ID es inválido." };
    }

    const isCourseValid = await isValidCourse(ID_COURSE);
    if (!isCourseValid) {
        return { error: "El curso no existe o el ID es inválido." };
    }

    const noteSaved = await Notes.create({
        ID_USER,
        ID_COURSE,
        DSC_TITLE,
        DSC_COMMENT,
        DATE_NOTE,
    });

    return { notes: noteSaved };
};

// Función para actualizar un curso
export const updateNoteLogic = async (notesId, { ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT, DATE_NOTE }) => {
    console.log(ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT, DATE_NOTE);
    const validationError = validateNote({
        ID_USER,
        ID_COURSE,
        DSC_TITLE,
        DSC_COMMENT,
        DATE_NOTE,
    });

    if (validationError) {
        return { error: validationError };
    }

    const isUserValid = await isValidUser(ID_USER);
    if (!isUserValid) {
        return { error: "El usuario no existe o el ID es inválido." };
    }

    const isCourseValid = await isValidCourse(ID_COURSE);
    if (!isCourseValid) {
        return { error: "El curso no existe o el ID es inválido." };
    }

    const note = await Notes.findOne({ where: { ID_STUDENT_NOTE: notesId } });
    if (!note) {
        return { error: "Nota no encontrado." };
    }

    await note.update({
        ID_USER,
        ID_COURSE,
        DSC_TITLE,
        DSC_COMMENT,
        DATE_NOTE,
    });

    return { note };
};