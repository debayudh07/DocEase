import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport"
// import session from "express-session"

const app = express()
//Middlewares

app.use(cors({ //STUDY ABOUT CORS
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"})) //form data
app.use(express.urlencoded({extended: true, limit: "16kb"})) //url data
app.use(express.static("public")) //to store some images or favicons etc
app.use(cookieParser()) //using cookie-parser
app.use(passport.initialize());



//importing routes
import doctorRoutes from "./routes/doctor.routes.js"
import patientRoutes from "./routes/patient.routes.js"
import messageRoutes from "./routes/message.routes.js"
import adminRoutes from "./routes/admin.routes.js"

//routes declaration 

//Doctor Routes
app.use("/api/v1/doctors", doctorRoutes) 


//Pateint Routes
app.use("/api/v1/patients", patientRoutes)


//Message Routes
app.use("/api/v1/messages", messageRoutes)

//Admin Routes
app.use("/api/v1/admin", adminRoutes)
export default app