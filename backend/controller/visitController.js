

import mongoose from 'mongoose';
import VisitRecord from '../models/visitModel.js';

// Create a new visit record
export const createVisit = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      patientName,
      date,
      age,
      gender,
      symptoms,
      diagnosis,
      medications,
      advice,
      doctor,
    } = req.body;

    if (
      !appointmentId || !patientId || !patientName || !date ||
      !age || !gender || !symptoms || !diagnosis || !doctor
    ) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existing = await VisitRecord.findOne({ appointmentId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Visit record for this appointment already exists.' });
    }

    const visit = new VisitRecord({
      appointmentId,
      patientId,
      patientName,
      date,
      age,
      gender,
      symptoms,
      diagnosis,
      medications,
      advice,
      doctor,
    });

    await visit.save();
    res.status(201).json({ success: true, message: 'Visit record created', data: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all visit records
export const getAllVisits = async (req, res) => {
  try {
    const visits = await VisitRecord.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: visits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get visit by ID
export const getVisitById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid visit ID format' });
    }

    const visit = await VisitRecord.findById(id);
    if (!visit) {
      return res.status(404).json({ success: false, message: 'Visit not found' });
    }

    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get visit by appointment ID
export const getVisitByAppointmentId = async (req, res) => {
  console.log("Request from:", req.user);
  const { appointmentId } = req.params;

  try {
    const visit = await VisitRecord.findOne({ appointmentId });
    if (!visit) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }

    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    console.error("getVisitByAppointmentId error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get recent visits
export const getRecentVisits = async (req, res) => {
  try {
    const visits = await VisitRecord.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, data: visits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


