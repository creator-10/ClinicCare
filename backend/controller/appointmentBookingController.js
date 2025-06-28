import Appointment from '../models/appointmentBookingModel.js';

export const submitAppointment = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dob,
      specialist,
      reason,
      slot,
      bookingDate,
    } = req.body;

    if (!fullName || !email || !phone || !dob || !specialist || !slot || !bookingDate) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const age = new Date().getFullYear() - new Date(dob).getFullYear();

    const newAppointment = new Appointment({
      fullName,
      email,
      phone,
      dob,
      age,
      specialist,
      reason,
      slot,
      bookingDate,
    });

    await newAppointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
