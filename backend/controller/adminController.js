import Doctor from '../models/doctorModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (email === process.env.ADMIN_EMAIL && isMatch) {
      const token = jwt.sign(
        { id: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        token,
        role: "admin"
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin login"
    });
  }
};

export const getPendingDoctors = async (req, res) => {
  const doctors = await Doctor.find({ approved: false }).populate('userId');
  res.json(doctors);
};

export const approveDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  res.json(doctor);
};

export const rejectDoctor = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Doctor rejected and deleted' });
};

export const getDoctorsList = async (req, res) => {
  try {
    const doctors = await Doctor
      .find({approved:true})
      .populate('userId'); // include profilePic!

    return res.status(200).json(doctors);
  } catch (err) {
    console.error('Get Doctors Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

