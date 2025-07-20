import mongoose from "mongoose";

const forgotpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  patientId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now} 
});

export default mongoose.model("ForgotPassword", forgotpSchema);