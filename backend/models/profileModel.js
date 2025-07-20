import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true }, // Now unique
  name: String,
  email: String,
  phone: String,
  address: {
    line1: String,
    line2: String,
  },
  gender: String,
  dob: String,
  image:  { type: String, default: "profile_pic.jpg" },
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);