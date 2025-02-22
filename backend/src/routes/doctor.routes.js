import { Router } from "express";
import { registerDoctor, loginDoctor, updateDoctor, deleteDoctor, getVerifiedDoctorProfile, updateDoctorAvailability, getAllApprovedDoctors } from "../controllers/doctor.controllers.js";
import  verifyJWT from "../middlewares/auth.middlewares.js";
import passport from "../utils/passport.js";
import { getDoctor } from "../middlewares/getDoctor.middlewares.js";

import multer from 'multer';
const upload = multer({ dest: 'uploads/' });


const router = Router();

//Authentication Routes

router.route("/register").post(registerDoctor);
//http://localhost:8000/api/v1/doctors/register

router.route("/login").post(loginDoctor);
//http://localhost:8000/api/v1/doctors/login

//Secured Routes

router.route("/update/availability/:id").patch(verifyJWT, updateDoctorAvailability);
//http://localhost:8000/api/v1/doctors/update/availability/:id 



router.route("/delete/:id").delete(deleteDoctor);
//http://localhost:8000/api/v1/doctors/delete/:id



//O-AUTH ROUTE

router.route("/auth/google").get(passport.authenticate("google", { scope: ["profile", "email"] }));
//http://localhost:8000/api/v1/doctors/auth/google

router.route("/auth/google/callback").get(passport.authenticate("google", { failureRedirect: "/login", session: false }), 
    (req, res) => {
        const { accessToken, refreshToken } = req.user;
            // Set tokens as HttpOnly cookies
        res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
        });
  
        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.redirect("/dashboard"); 
    }
);
//http://localhost:8000/api/v1/doctors/auth/google/callback

router.route("/logout").get((req, res) => {
    req.logout();
    res.redirect("/login");
});
//http://localhost:8000/api/v1/doctors/logout


//Other Routes
 /*
 1. Route for getting all admin approved doctors
 2. Route for getting all admin approved doctors by specialty etc.
 3. Route for fetching doctor details
 4. Route for fetching doctor reviews
 5. Route for fetching doctor appointments

 */

router.route("/profile/:id").get(getVerifiedDoctorProfile);
//http://localhost:8000/api/v1/doctors/profile/:id

router.route("/update/:id").put( updateDoctor);
//http://localhost:8000/api/v1/doctors/update/:id

router.route("/availability/:id").patch(updateDoctorAvailability);
//http://localhost:8000/api/v1/doctors/availability/:id

router.route("/approved").get(getAllApprovedDoctors);
//http://localhost:8000/api/v1/doctors/approved


//http://localhost:8000/api/v1/doctors/:id
export default router;