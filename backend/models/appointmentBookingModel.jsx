import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, required: true },
  dob:       { type: Date,   required: true },
  age:       { type: Number, required: true },
  specialist:{ type: String, required: true },
  reason:    { type: String, default: '' },
  bookingDate:{ type: Date, required: true },
  slot:      { type: String, required: true },
}, {
  timestamps: true
});

const Appointment = mongoose.model('AppointmentBooking', appointmentSchema);
export default Appointment;
