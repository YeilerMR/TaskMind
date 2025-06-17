import { Router } from "express";
import { registerEvaluation, updateEvaluation, evaluationsByUserID, deleteEvaluation } from "../controller/evaluation.controller.js";

const router = Router();

router.post("/register", registerEvaluation);
//router.get('/all_course', getAllCourses);
router.get("/search_evaluation", evaluationsByUserID);
router.put("/update_evaluation/:id", updateEvaluation);
router.delete("/delete_evaluation/:id", deleteEvaluation);

export default router;