import { Router } from "express";
import { userSchema,updateUserSchema } from "../schema/user.schema.js";
import { validateSchema } from "../middleware/validateMiddleware.js";
import { registerUsers,updateUser } from "../controller/user.controller.js";

const router = new Router();

router.post('/registerUser', validateSchema(userSchema), registerUsers);
router.put('/updateUser/:id',validateSchema(updateUserSchema),updateUser);


export default router;



