// doctorController.js

import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';

const registerDoctor = async (req, res) => {
  try {
    console.log("Doctor registration body:", req.body);
    const { username, email, password, specialization, experience, gender, address } = req.body;

    if (!email || !password || !username || !specialization || !experience || !gender) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    const isEmailExists = await userModel.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const passwordFormat = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordFormat.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long, include one uppercase letter and one number",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      gender,
      role: "doctor",
      address: {
        line1: address.line1,
        line2: address.line2 || ""
      }
    });

    const savedUser = await newUser.save();

    const newDoctor = new doctorModel({
      userId: savedUser._id,
      email: savedUser.email,
      experience,
      specialization,
      approved: false,
    });

    await newDoctor.save();

    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET);
    res.status(201).json({
      success: true,
      token,
      role: savedUser.role,
      message: "Doctor registered successfully. Awaiting admin approval."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}; 

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.user.id }).populate('userId');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({
      name: doctor.userId?.username || doctor.userId?.name,
      specialization: doctor.specialization,
      availabilitySlots: doctor.availabilitySlots,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const setAvailability = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { availabilitySlots } = req.body;

    if (!availabilitySlots || !Array.isArray(availabilitySlots) || availabilitySlots.length === 0) {
      return res.status(400).json({ success: false, message: "Provide at least one availability slot" });
    }

    const allValid = availabilitySlots.every(slot => !isNaN(new Date(slot).getTime()));
    if (!allValid) {
      return res.status(400).json({ success: false, message: "Invalid date format in slots" });
    }

    const doctor = await doctorModel.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (!doctor.approved) {
      return res.status(403).json({ success: false, message: "You are not approved" });
    }

    doctor.availabilitySlots = availabilitySlots;
    await doctor.save();

    return res.status(200).json({ success: true, message: "Availability slots updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.user.id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const user = await userModel.findById(req.user.id);
    const appointments = await Appointment.find({
      specialist: doctor.specialization,
      doctorName: user.username || user.name
    });

    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDoctorAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await doctorModel.findById(id);

    if (!doctor || !doctor.approved) {
      return res.status(404).json({ success: false, message: 'Doctor not found or not approved' });
    }

    res.status(200).json({
      success: true,
      availability: doctor.availabilitySlots || [],
    });
  } catch (err) {
    console.error('Error fetching doctor availability:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export {
  registerDoctor,
  getDoctorProfile,
  setAvailability,
  getDoctorAppointments,
  getDoctorAvailabilityById
};
