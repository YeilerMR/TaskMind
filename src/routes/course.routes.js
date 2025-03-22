import { Router } from "express";
import { registerCourse, getAllCourses, searchCourse, updateCourse, deleteCourse } from "../controller/course.controller.js";
import { validateSchema, asyncHandler } from "../middleware/validator.middleware.js";
import { courseSchema } from "../schema/course.schema.js";

const router = Router();

// Parte de administración de courses
router.post("/register", /*auth,*/ validateSchema(courseSchema), registerCourse);
router.get('/all_course', getAllCourses);
router.get("/search_course", /*auth,*/ searchCourse);
router.put("/update_course/:id", /*auth,*/ validateSchema(courseSchema), updateCourse);
router.delete("/delete_course/:id", /*auth,*/ deleteCourse);

export default router;
