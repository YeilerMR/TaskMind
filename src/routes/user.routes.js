import { Router } from "express";
import { userSchema,updateUserSchema } from "../schema/user.schema.js";
import { validateSchema } from "../middleware/validateMiddleware.js";
import { auth, verifyUpdateAccess } from "../middleware/auth.middleware.js";
import { registerUsers,updateUser,deleteUser } from "../controller/user.controller.js";

const router = new Router();

router.post('/registerUser',validateSchema(userSchema), registerUsers);
router.put('/updateUser/:id',validateSchema(updateUserSchema),updateUser);
router.put('/deleteUser/:id',auth,verifyUpdateAccess,deleteUser);


export default router;



