import { Router } from "express";
import { homepageLanding } from "../controller/homepage.controller.js";

const router = Router();

router.get('/getHomePage', homepageLanding);

export default router;