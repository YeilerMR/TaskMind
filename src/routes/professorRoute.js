import { Router } from "express";

//Falta agregar los demas endpoints
import { getAllProfessors } from "../controller/professorController.js";

import { asyncHandler } from "../middleware/validateMiddleware.js";
// import { professorSchema } from "../schema/professorSchema";

const router = Router();

router.get('/professors', asyncHandler(getAllProfessors));
//falta los demas metodos HTTP


export default router;