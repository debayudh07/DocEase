import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import Patient from "../models/users.models.js";


const generateAccessandRefreshToken = async(userId)=>{
    try {
        const patient =await Patient.findById(userId)
        console.log("inside function ",patient)
        const accessToken = patient.generateAccessToken()
        const refreshToken = patient.generateRefreshToken()

        console.log("accessToken", accessToken, "refreshToken", refreshToken);

        patient.refreshToken = refreshToken
        await patient.save({ validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new apiError(500,"Something went wrong while generating tokens")
    }
}


const registerPatient = asyncHandler(async (req, res, next) => {
    const { 
        name,
        contact_info,
        password
    } = req.body
    const {email, phone} = contact_info
    if (!name || !email && !phone || !password) {
        throw new apiError("Please provide all required fields", 400);
      }

    //also check phone and email validation using zod (??)


    console.log(name, email, phone, password);
    const existingPatient = await Patient.findOne({
        $or: [{"contact_info.email":email},{"contact_info.phone":  phone}]
    });
    console.log(existingPatient);
    if (existingPatient) {
        throw new apiError("Patient already exists", 400);
    }
    const newPatient = await Patient.create({
        name,
        contact_info:{
            email,
            phone: phone || 0
        },
        password
    })

    const createdPatient = await Patient.findById(newPatient._id).select("-password -refreshToken")

    if(!createdPatient){
        throw new apiError(500,"Registering User failed")
    }
    
    res.status(201).json(
        new apiResponse(200, createdPatient, "User registered")
    )
});

const getPatient = asyncHandler(async (req, res, next) => {
});

const loginPatient = asyncHandler(async (req, res, next) => {
    const {name, contact_info, password}= req.body
    console.log(name, contact_info, password);
    if(!name || !contact_info.email || !password){
        throw new apiError(400, "Username or Email is rerquired")
    }

    const patient = await Patient.findOne({
        $or: [{ "contact_info.email": contact_info.email }, { "contact_info.phone": contact_info.phone }]
    })

    if(!patient){
        throw new apiError(400, "User does not exist")
    }

    const isPasswordValid = await patient.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401, "Invalid Password")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(patient._id)

    const loggedinUser = await Patient.findById(patient._id)
    .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken",accessToken, options) //adding refresh and access token to cookies
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(200,{
            user: loggedinUser, accessToken, refreshToken //alada kore send korchi karon user locally store korte chaite pare for developping maybe mobile app( eta data field)
        },
            "User Logged in successfully"
        )
    )
});

const updatePatient = asyncHandler(async (req, res, next) => {
});

export {registerPatient , getPatient, loginPatient, updatePatient};