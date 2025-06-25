const VisitRecord = require('../models/visitModel');

// Create a new visit record
exports.createVisit = async (req, res) => {
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
      doctor
    } = req.body;

    // Validate required fields
    if (
      !appointmentId ||
      !patientId ||
      !patientName ||
      !date ||
      !age ||
      !gender ||
      !symptoms ||
      !diagnosis ||
      !doctor
    ) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check for duplicate by appointmentId
    const existing = await VisitRecord.findOne({ appointmentId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Visit record for this appointment already exists.' });
    }

    // Create visit record (no id field)
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
      doctor
    });

    await visit.save();
    res.status(201).json({ success: true, message: 'Visit record created', data: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all visit records
exports.getAllVisits = async (req, res) => {
  try {
    const visits = await VisitRecord.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: visits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get visit record by appointmentId
exports.getVisitByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const visit = await VisitRecord.findOne({ appointmentId });
    if (!visit) {
      return res.status(404).json({ success: false, message: 'Visit record not found' });
    }
    res.status(200).json({ success: true, data: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recent visit records (latest 10)
exports.getRecentVisits = async (req, res) => {
  try {
    const visits = await VisitRecord.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, data: visits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};