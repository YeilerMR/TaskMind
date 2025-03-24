import { Router } from "express";

//Falta agregar los demas endpoints
import { getAllProfessors, registerProfessor, searchProfessor, updateProfessor, deleteProfessor } from "../controller/professorController.js";
import { validateSchema } from "../middleware/validateMiddleware.js";
//import { asyncHandler } from "../middleware/validateMiddleware.js";
import { professorSchema } from "../schema/professorSchema.js";

const router = Router();

router.get('/all_professors', getAllProfessors);
//falta los demas metodos HTTP
router.post('/register_professor', validateSchema(professorSchema), registerProfessor);
router.put('/update_professor/:id', validateSchema(professorSchema), updateProfessor);
router.delete('/delete_professor/:id', deleteProfessor);
router.get('/search_professor', searchProfessor);

export default router;