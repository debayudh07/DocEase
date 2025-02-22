import { Schema, model } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    googleId: { 
      type: String, 
      unique: true, 
      sparse: true 
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
        // unique: true,
        // sparse: true,
      },
      emergency_contact: {
          type: Number,
      }
    },
    password: {
       type: String,
      // required: () =>{
      //   return this.googleId ? false : true}
    },
    refreshToken: {
      type: String
    },
    profileImage: {
      type: String,
    },
    medical_certificates: {
        type: [String],
        default: []
    },
    blood_group: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],

    },
    allergies: {
        type: [String],
        default: []
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
  }, { timestamps: true });

  
  userSchema.index(
    { 'contact_info.phone': 1 },
    {
      unique: true,
      partialFilterExpression: { 
        'contact_info.phone': { $exists: true, $ne: null }
     }
    }
  );

  userSchema.pre("save", async function(next){ //pre is a hook just like post etc and save is a method
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
  })

  userSchema.methods.isPasswordCorrect = async function(password){ //isPasswordCorrect is a user defined method
    return await bcrypt.compare(password, this.password)
}

  userSchema.methods.generateAccessToken = function(){
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
userSchema.methods.generateRefreshToken = function(){
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

  const User = model('User', userSchema);
  
  
  export default User