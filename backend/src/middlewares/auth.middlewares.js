import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import Doctor from "../models/doctors.models.js";


const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "")
        
        console.log("user given token::",token);
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        console.log("Decoded token::",decodedToken);
    
        const doctor = await Doctor.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!doctor) {
            
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.user = doctor;
        next()
        
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
    
})

export default verifyJWT