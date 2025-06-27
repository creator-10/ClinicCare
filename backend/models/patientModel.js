// here file name given patientModel.js but in system it is /models/userModel.js


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  patientId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true }
}, { timestamps: true });

const User = mongoose.model("PatientDetails", userSchema);

export default User;
