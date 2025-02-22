import {Schema, model} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const medicineSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    generic_name: {
      type: String,
      required: true,
      trim: true,
    },
    uses: {
      type: [String],
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    form: {
      type: String,
      required: true,
      enum: ["tablet", "syrup", "injection", "capsule", "cream"],
    },
    manufacturer: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    side_effects: {
      type: [String],
      default: [],
    },
    contraindications: {
      type: [String],
      default: [],
    },
  });
  
  const Medicine = mongoose.model('Medicine', medicineSchema);
  
  module.exports = Medicine;