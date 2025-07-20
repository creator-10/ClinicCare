import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, index: true },
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "" },
  dob: { type: Date },
  address: {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" }
  },
  role: {
    type: String,
    default: "patient",
    enum: ["patient", "doctor", "admin"],
  },
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
