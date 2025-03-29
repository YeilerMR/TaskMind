import { Router } from "express";
import { registerNote, getAllNotes, searchNotes, updateNote, deleteNote } from "../controller/notes.controller.js";
import { validateSchema, asyncHandler } from "../middleware/validator.middleware.js";
import { noteSchema } from "../schema/notes.schema.js";

const router = Router();

// Parte de administración de courses
router.post("/register", /*auth,*/ registerNote);
router.get('/all_notes', getAllNotes);
router.get("/search_note", /*auth,*/ searchNotes);
router.put("/update_note/:id", /*auth,*/ updateNote);
router.delete("/delete_note/:id", /*auth,*/ deleteNote);

export default router;
