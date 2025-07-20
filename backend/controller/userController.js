import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';

const generatePatientId = () => Math.floor(1000 + Math.random() * 9000).toString();

// Register user (patient)
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, gender, dob } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const patientId = generatePatientId();

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      dob,
      role: 'patient',
      patientId
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token,
      role: savedUser.role,
      name: savedUser.username,
      patientId: savedUser.patientId
    });

    console.log('User registered:', savedUser.email);

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login user (patient, doctor, admin)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET);
      console.log('Admin logged in');
      return res.status(200).json({ success: true, token, role: 'admin' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    if (user.role === 'doctor') {
      const doctor = await doctorModel.findOne({ userId: user._id });
      if (!doctor || !doctor.approved) {
        return res.status(403).json({ success: false, message: 'Doctor not approved yet' });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.username },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      token,
      role: user.role,
      name: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      dob: user.dob,
      patientId: user.patientId,
      profilePic: user.profilePic || '',
      address: user.address || {}
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
