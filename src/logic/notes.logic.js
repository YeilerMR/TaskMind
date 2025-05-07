import { noteSchema } from "../schema/notes.schema.js";
import Notes from "../model/note.model.js";
import User from "../model/user.model.js";
import Course from "../model/course.model.js";

// Function to check if the professor is valid
export const isValidUser = async (ID_USER) => {
    const user = await User.findOne({ where: { ID_USER: ID_USER } });
    return user;
};

// Function to check if the course is valid
export const isValidCourse = async (ID_COURSE) => {
    const course = await Course.findOne({ where: { ID_COURSE: ID_COURSE} });
    return course;
};

// Function to validate data types
export const validateNote = (noteData) => {
    const validatedData = {
        ID_USER: noteData.ID_USER !== undefined ? Number(noteData.ID_USER) : null,
        ID_COURSE: noteData.ID_COURSE !== undefined ? Number(noteData.ID_COURSE) : null,
        DSC_TITLE: noteData.DSC_TITLE !== undefined ? String(noteData.DSC_TITLE).trim() : null,
        DSC_COMMENT: noteData.DSC_COMMENT !== undefined ? String(noteData.DSC_COMMENT).trim() : null,
        DATE_NOTE: noteData.DATE_NOTE !== undefined ? String(noteData.DATE_NOTE).trim() : null,
    };

    // basics validations
    const errors = [];
    
    if (!validatedData.ID_USER) errors.push("El ID del usuario es obligatorio");
    if (!validatedData.ID_COURSE) errors.push("El ID del curso es obligatorio");
    if (!validatedData.DSC_TITLE) errors.push("El título de la nota es obligatorio");
    if (!validatedData.DATE_NOTE) errors.push("La fecha de la nota es obligatoria");
    
    if (isNaN(validatedData.ID_USER)) errors.push("El ID del usuario debe ser numérico");
    if (isNaN(validatedData.ID_COURSE)) errors.push("El ID del curso debe ser numérico");

    if (errors.length > 0) {
        return { error: errors.join(", ") };
    }
    console.log("validate date");
    // Validación con Zod
    const result = noteSchema.safeParse(validatedData);
    if (!result.success) {
        return { error: result.error.errors.map(e => e.message).join(", ") };
    }

    return { validatedData: result.data };
};

// Function to create a new note
export const createNoteLogic = async ({ ID_USER, ID_COURSE, DSC_TITLE, DSC_COMMENT, DATE_NOTE }) => {
   
    const isUserValid = await isValidUser(ID_USER);
    if (!isUserValid) {
        return { error: "El usuario no existe o el ID es inválido." };
    }

    console.log("hola");
    const noteSaved = await Notes.create({
        ID_USER,
        ID_COURSE,
        DSC_TITLE,
        DSC_COMMENT,
        DATE_NOTE,
    });
    console.log("hola");
    return { Notes: noteSaved };
};

// Function to update an existing note
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

