import asyncHandler from "../utils/asyncHandler.js";
import Doctor from "../models/doctors.models.js";

const getDoctor = asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
        return next(new apiError('Doctor not found', 404));
    }
    req.doctor = doctor;
    next();
});

export { getDoctor };