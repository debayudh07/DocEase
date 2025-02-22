import { Schema, model } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const availabilitySchema = new Schema({
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    recurring: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: null,
    },
  });
  
  const doctorSchema = new Schema({
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    googleId: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
    specialty: {
      type: [String],
    },
    qualifications: {
      type: [String],
    },
    experience: {
      type: Number,
    },
    availability: {
      type: [availabilitySchema],
      default: [],
    },
    contact_info: {
      email: {
        type: String,
        validate: {
          validator: function() {
            return this.contact_info.email || this.contact_info.phone;
          },
          message: 'At least one of email or phone is required.'
        },
        unique: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: Number,
        validate: {
          validator: function() {
            return this.contact_info.email || this.contact_info.phone;
          },
          message: 'At least one of email or phone is required.'
        },
      },
    },
    hospital_affiliation: {
      type: String,
    },
    consultation_fee: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    password: {
       type: String,
      // required: () =>{
      //   return this.googleId ? false : true}
    },
    refreshToken: {
      type: String
  },
    registrationNumber: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });
  
  doctorSchema.index(
    { 'contact_info.phone': 1 },
    {
      unique: true,
      partialFilterExpression: 
      { 
        'contact_info.phone': { $exists: true, $ne: null }
      }
    }
  );


  doctorSchema.pre("save", async function(next){ //pre is a hook just like post etc and save is a method
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
  })

  doctorSchema.methods.isPasswordCorrect = async function(password){ //isPasswordCorrect is a user defined method
    return await bcrypt.compare(password, this.password)
}

  doctorSchema.methods.generateAccessToken = function(){
    const accessToken = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            phone: this.phone
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

  return accessToken
}
doctorSchema.methods.generateRefreshToken = function(){
    const refreshToken = jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

  return refreshToken
}

  const Doctor = model('Doctor', doctorSchema);
  
  
  export default Doctor