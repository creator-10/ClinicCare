const Doctor = require('../models/doctorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    // Check admin credentials from env
    if (
      email === process.env.ADMIN_EMAIL &&
      await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    ) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.status(200).json({ success: true, token, role: "admin" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all pending doctors
const getPendingDoctors = async (req, res) => {
  const doctors = await Doctor.find({ approved: false }).populate('userId');
  res.json(doctors);
};

// Approve doctor
const approveDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  res.json(doctor);
};

// Reject doctor (delete)
const rejectDoctor = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Doctor rejected and deleted' });
};

// List all approved doctors
const getApprovedDoctors = async (req, res) => {
  const doctors = await Doctor.find({ approved: true }).populate('userId');
  res.json(doctors);
};

module.exports = {
  loginAdmin,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getApprovedDoctors,
};