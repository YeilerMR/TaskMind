import { Router } from "express";
import { registerEvaluation, updateEvaluation, evaluationsByUserID } from "../controller/evaluation.controller.js";

const router = Router();

router.post("/register", registerEvaluation);
//router.get('/all_course', getAllCourses);
router.get("/search_evaluation", evaluationsByUserID);
router.put("/update_evaluation/:id", updateEvaluation);
//router.delete("/delete_course/:id", deleteCourse);

export default router;