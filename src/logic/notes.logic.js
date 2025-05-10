import { noteSchema } from "../schema/notes.schema.js";
import Notes from "../model/note.model.js";
import User from "../model/user.model.js";
import Course from "../model/course.model.js";


// Function to check if the course is valid


// Function to validate data types
export const validateNote = (noteData) => {
  const data = {
         ID_USER: Number(noteData.ID_USER),
         ID_COURSE: Number(noteData.ID_COURSE),
         DSC_TITLE: String(noteData.DSC_TITLE?? "").trim(),
         DSC_COMMENT: String(noteData.DSC_COMMENT ?? "").trim(),
         DATE_NOTE: String(noteData.DATE_NOTE ?? "").trim(),
       
     };
     const result = noteSchema.safeParse(data);
     if (!result.success) {
         return result.error.errors.map(e => e.message).join(", ");
     }
 
     return null;
};

export const isValidCourse = async (ID_COURSE) => {
    const course = await Course.findOne({ where: { ID_COURSE: ID_COURSE} });
    return course;
};

export const isValidUser = async (ID_USER) => {
    const user = await User.findOne({ where: { ID_USER: ID_USER} });
    return user;
};

// Function to create a new note
export const createNoteLogic = async (data) => {
    const error = validateNote(data);
    if (error) return { error };

    const user = await User.findOne({
        where: { DSC_IDENTIFICATION: data.ID_USER },
        attributes: ['ID_USER'],
    });

    if (!user) return { error: "Usuario no encontrado con esa cédula." };

     const isCourseValid = await isValidCourse(data.ID_COURSE);
    if (!isCourseValid) {
        return { error: "El curso no existe o el ID es inválido." };
    }

    data.ID_USER = user.ID_USER;

    const isUserValid = await isValidUser(data.ID_USER);
    if (!isUserValid) {
        return { error: "El usuario no existe o el ID es inválido." };
    }

    

    const note = await Notes.create(data);
    return { success: true, note };
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

