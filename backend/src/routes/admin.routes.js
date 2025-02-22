import { Router } from "express";
import { adminLogin, verifyDoctors} from "../controllers/admin.controllers.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middlewares.js";
const router = Router();

router.route("/login").post(adminLogin);


router.route("/verify/:id").put(verifyAdminJWT, verifyDoctors);

export default router;