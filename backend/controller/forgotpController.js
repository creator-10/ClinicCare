//controller/forgotpController.js
// backend/controller/forgotpController.js

import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Step 1: Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "Email not found" });
    res.json({ success: true, message: "Email exists" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Step 2: Verify Patient ID
export const verifyPatientId = async (req, res) => {
  try {
    const { email, patientId } = req.body;
    const user = await userModel.findOne({ email, patientId });
    if (!user) return res.json({ success: false, message: "Invalid Patient ID or email mismatch" });
    res.json({ success: true, message: "Patient ID matches" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Step 3: Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, patientId, newPassword } = req.body;
    const user = await userModel.findOne({ email, patientId });
    if (!user) return res.json({ success: false, message: "User not found" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
