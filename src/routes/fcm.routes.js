import { Router } from "express";
import { registerFcmToken } from "../controller/fcm.controller.js";

const router = Router();
router.post("/register", registerFcmToken);
export default router;