/*
1. Admin signup
2. Admin Login
3. Verify Doctor
..
*/

import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import Doctor from "../models/doctors.models.js";
// import User from "../models/patient.models.js";


const adminLogin = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body
    console.log(email, password);
    if (!email || !password) {
        throw new apiError("Please provide all required fields", 400);
    }
    if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
        throw new apiError("Invalid credentials", 400);
    }

    const adminToken = jwt.sign({ admin: true, email: email , password: password}, process.env.ADMIN_JWT_SECRET, { expiresIn: '1h' });

    res.cookie('adminToken', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
    })
    .status(200)
    .json(
        new apiResponse(200, {
            adminToken
        }, "Admin logged in successfully")
    );
});

const verifyDoctors = asyncHandler(async (req, res, next) => {
    const doctorId = req.params.id
    const doctor = await Doctor.findById(doctorId)    
    if(!doctor){
            throw new apiError("Doctor not found", 404)
    }
    if(doctor.isVerified){
        throw new apiError("Doctor is already verified", 400)
    }
    doctor.isVerified = true
    await doctor.save()

    // add email to verified doctors
    
    return res.status(200)
    .json(
        new apiResponse(200, {
            user: doctor
        }, "Doctor verified successfully")
    )
});

export {adminLogin, verifyDoctors};