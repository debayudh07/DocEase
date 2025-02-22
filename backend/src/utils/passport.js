import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Doctor from "../models/doctors.models.js";


const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = "http://localhost:8000/api/v1/doctors/auth/google/callback";

// console.log(clientID, clientSecret, callbackURL);
// console.log(GoogleStrategy);

passport.use(
    new GoogleStrategy(
        {
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile.id);
            try {
                let newdoctor = await Doctor.findOne({
                    $or: [{ "googleId": profile.id }, { "contact_info.email": profile.emails[0].value }]
                })
                if (newdoctor) {
                    const doctor = await Doctor.findById(newdoctor._id)
                    console.log(doctor);
                    const accessTokenJWT = doctor.generateAccessToken()
                    const refreshTokenJWT = doctor.generateRefreshToken()
                    console.log("accessTokenJWT", accessTokenJWT, "refreshTokenJWT", refreshTokenJWT);
                    return done(null,  {
                        accessToken: accessTokenJWT,
                        refreshToken: refreshTokenJWT,
                        doctor
                    });
                }
                console.log("check 1")
                newdoctor = await Doctor.create({
                    name: profile.displayName,
                    googleId: profile.id,
                    profileImage: profile.photos[0].value,
                    contact_info: {
                        email: profile.emails[0].value,
                        phone: 0
                    }
                })
                const doctor = await Doctor.findById(newdoctor._id).select("-password -refreshToken")
                console.log(doctor);
                const accessTokenJWT = doctor.generateAccessToken()
                const refreshTokenJWT = doctor.generateRefreshToken()
                console.log("accessTokenJWT", accessTokenJWT, "refreshTokenJWT", refreshTokenJWT);
                return done(null, {
                    accessToken: accessTokenJWT,
                    refreshToken: refreshTokenJWT,
                    doctor
                })
            } catch (error) {
                console.log(error);
            }
        }
    )
);

export default passport;