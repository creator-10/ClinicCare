// here file name give patientController.js but in system saved as /controllers/userController.js
import User from '../models/userModel.js'; // assuming Mongoose
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dob, patientId } = req.body;

    if (!name || !email || !password || !phone || !gender || !dob || !patientId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      gender,
      dob: new Date(dob),
      patientId
    });

    res.status(201).json({ success: true, patientId: user.patientId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Optionally issue an auth token
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob.toISOString().split('T')[0],
        patientId: user.patientId,
        profilePic: user.profilePic || ''
      }
      // token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const profileUser = async (req, res) => {
  // example implementation
  res.status(200).json(req.user);
};
