import { Router } from "express";
import { createCourseFromPdfController } from "../logic/pdf/pdfRead.logic.js";
import multer from 'multer';


const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = Router();

router.post("/registerPDF/:id", upload.single("pdf"), createCourseFromPdfController);


export default router;