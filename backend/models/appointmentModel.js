import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  specialist: { type: String, required: true },
  clinic: { type: String, required: true },
  doctorName: { type: String, required: true },
  reason: { type: String, default: "" },
  slot: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  appointmentId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
