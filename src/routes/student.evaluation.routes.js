import { Router } from "express";
import { registerStudentEvaluation, updateStudentEvaluation, deleteStudentEvaluation } from "../controller/student.evaluation.controller.js";

const router = Router();

router.post("/register", registerStudentEvaluation);
router.put("/update_student_evaluation/:id", updateStudentEvaluation);
router.delete("/delete_student_evaluation/:id", deleteStudentEvaluation);

export default router;