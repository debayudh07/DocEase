import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import Patient from "../models/users.models.js";
import Doctor from "../models/doctors.models.js";
import Appointment from "../models/appointment.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    if(!name || !contact_info.email&&!contact_info.phone || !password){
        throw new apiError(400, "Phone or email is reqired")
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
    // 1. Parse JSON fields from FormData strings
    if (req.body.allergies) {
      try {
        req.body.allergies = JSON.parse(req.body.allergies);
      } catch (error) {
        return next(new apiError("Invalid allergies format", 400));
      }
    }
  
    if (req.body.contact_info) {
      try {
        req.body.contact_info = JSON.parse(req.body.contact_info);
      } catch (error) {
        return next(new apiError("Invalid contact info format", 400));
      }
    }
  
    // 2. Process file uploads
    const updateData = { ...req.body };
  
    // Handle profile image
    if (req.files?.profileImage) {
      const profileFile = req.files.profileImage[0];
      // Upload logic...
    }
  
    // Handle medical certificates
    if (req.files?.medical_certificates) {
      const certFiles = req.files.medical_certificates;
      const uploadedUrls = [];
      
      for (const file of certFiles) {
        const result = await uploadOnCloudinary(file.path);
        if (result?.secure_url) {
          uploadedUrls.push(result.secure_url);
        }
      }
      
      updateData.medical_certificates = uploadedUrls;
    }
  
    // 3. Update database
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
  
      if (!patient) {
        return next(new apiError("Patient not found", 404));
      }
  
      res.status(200).json(
        new apiResponse(200, patient, "Patient updated successfully")
      );
    } 
  );

const bookAppointment = asyncHandler(async (req, res, next) => {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Validate required fields
    // if (!amount) {
    //     throw new apiError(400, "Amount is required");
    // }

    // Check doctor existence and get data
    console.log(docId);
    const doctor = await Doctor.findById(docId).lean();
    if (!doctor) {
        throw new apiError(404, "Doctor not found");
    }

    // Check patient existence and get data
    const patient = await Patient.findById(userId).lean();
    if (!patient) {
        throw new apiError(404, "Patient not found");
    }

    // Validate slotDate format
    const slotDateObj = new Date(slotDate);
    if (isNaN(slotDateObj.getTime())) {
        throw new apiError(400, "Invalid date format");
    }

    // Get day name from slot date
    const slotDay = slotDateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // Check doctor availability
    const isAvailable = doctor.availability.some(availability => {
        if (availability.recurring) {
            return availability.day === slotDay &&
                   slotTime >= availability.start_time &&
                   slotTime <= availability.end_time;
        }
        return availability.date === slotDate &&
               slotTime >= availability.start_time &&
               slotTime <= availability.end_time;
    });

    if (!isAvailable) {
        throw new apiError(400, "Time slot not available");
    }

    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({
        doctorId: docId,
        date: slotDateObj,
        time: slotTime
    });

    if (existingAppointment) {
        throw new apiError(400, "Time slot already booked");
    }

    // Create new appointment
    const appointment = await Appointment.create({
        patientId: userId,
        doctorId: docId,
        patientData: patient,
        doctorData: doctor,
        date: slotDateObj,
        time: slotTime,
        status: "pending",
        paymentStatus: "pending"
    });

    res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        appointment
    });
});

export {registerPatient , getPatient, loginPatient, updatePatient, bookAppointment};