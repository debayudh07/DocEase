import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import Doctor from "../models/doctors.models.js";
import Patient from "../models/users.models.js";

export const verifyAdminJWT = asyncHandler(async(req, res, next) => {
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
            
            if (!token) {
                throw new apiError(401, "Unauthorized request")
            }
            const decodedToken = jwt.verify(token, process.env.ADMIN_JWT_SECRET)
    
            if(!decodedToken.admin && decodedToken.email !== process.env.ADMIN_EMAIL && decodedToken.password !== process.env.ADMIN_PASSWORD){
                throw new apiError(401, "Unauthorized request")
            }
    
            next()
        } catch (error) {
            throw new apiError(401, error?.message || "Invalid access token")
        }
            
})

export default verifyAdminJWT