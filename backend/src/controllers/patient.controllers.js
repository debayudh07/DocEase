import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import Patient from "../models/users.models.js";
import Doctor from "../models/doctors.models.js";
import Appointment from "../models/appointment.models.js";


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
    // Define allowed fields (excluding profileImage which we'll handle separately)
    const allowedFields = [
        'name',
        'specialty',
        'qualifications',
        'experience',
        'contact_info',
        'hospital_affiliation',
        'consultation_fee',
        'registrationNumber'
    ];

    // Build update object from allowed fields
    const updateData = {};
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    // Handle profile image upload
    if (req.file) {
        try {
            // Upload new image to Cloudinary
            const uploadResponse = await uploadOnCloudinary(req.file.path);
            
            if (!uploadResponse || !uploadResponse.secure_url) {
                return next(new apiError("Failed to upload profile image", 500));
            }
            
            // Add new image URL to update data
            updateData.profileImage = uploadResponse.secure_url;

            // If updating existing image, delete old image from Cloudinary
            if (req.doctor?.profileImage) {
                const publicId = req.doctor.profileImage.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        } catch (error) {
            return next(new apiError("Image upload failed: " + error.message, 500));
        }
    }

    // Validate contact info
    if (updateData.contact_info) {
        if (!updateData.contact_info.email && !updateData.contact_info.phone) {
            return next(new apiError("Contact info requires email or phone", 400));
        }
    }

    // Get doctor ID
    const doctorId = req.params.id;

    try {
        // Find and update doctor
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -availability');

        if (!updatedDoctor) {
            return next(new apiError("Doctor not found", 404));
        }

        res.status(200).json(
            new apiResponse(200, updatedDoctor, "Doctor updated successfully")
        );
    } catch (error) {
        return next(new apiError("Update failed: " + error.message, 500));
    }
});

const bookAppointment = asyncHandler(async (req, res, next) => {
    const { userId, docId, slotDate, slotTime, amount } = req.body;

    // Validate required fields
    if (!amount) {
        throw new apiError(400, "Amount is required");
    }

    // Check doctor existence and get data
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
        amount: amount,
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