const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, required: true }
});

const VisitRecordSchema = new mongoose.Schema({
  id: { type: String, required: true},
  appointmentId: { type: String, required: true  },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  date: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medications: { type: [MedicationSchema], default: [] },
  advice: { type: String },
  doctor: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.VisitRecord || mongoose.model('VisitRecord', VisitRecordSchema);