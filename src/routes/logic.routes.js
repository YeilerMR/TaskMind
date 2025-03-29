import { Router } from "express";
import {loginSchema } from "../schema/user.schema.js";
import { validateSchema } from "../middleware/validateMiddleware.js";
import { login } from "../controller/login.controller.js";


const router = new Router();

router.post('/loginAccess', validateSchema(loginSchema), login);



export default router;
