import { Router } from "express";
import { registerCourse, getAllCourses, searchCourse, updateCourse, deleteCourse } from "../controller/course.controller.js";

const router = Router();

router.post("/register", registerCourse);
router.get('/all_course', getAllCourses);
router.get("/search_course", searchCourse);
router.put("/update_course/:id", updateCourse);
router.delete("/delete_course/:id", deleteCourse);

export default router;
