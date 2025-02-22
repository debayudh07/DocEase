import { Router } from "express";
import { registerPatient, loginPatient, bookAppointment } from "../controllers/patient.controllers.js";
import passport from "../utils/passport.js";


const router = Router();

router.route("/register").post(registerPatient);
//http://localhost:8000/api/v1/patients/register

router.route("/login").post(loginPatient);
//http://localhost:8000/api/v1/patients/login

router.route("/book/appointment").post(bookAppointment)
//http://localhost:8000/api/v1/patients/book/appointment



export default router;