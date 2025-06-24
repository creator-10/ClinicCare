const validator = require("validator");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel.js");
const doctorModel = require("../models/doctorModel.js");

const registerDoctor = async (req, res) => {
  try {
    console.log("Doctor registration body:", req.body);
    const { username, email, password, specialization, experience } = req.body;

    if (!username || !email || !password || !specialization || !experience) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      role: "doctor",
    });
    const savedUser = await newUser.save();

    // Save doctor
    const newDoctor = new doctorModel({
      userId: savedUser._id,
      email,
      specialization,
      experience,
      approved: false,
    });
    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully. Awaiting admin approval.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerDoctor };