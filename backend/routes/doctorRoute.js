// routes/doctorRoutes.js

import express from 'express';
import {
  registerDoctor,
  setAvailability,
  getDoctorProfile,
  getDoctorAppointments,
  getDoctorAvailabilityById
} from '../controller/doctorController.js';

import auth from '../middlewares/authUser.js';

const doctorRouter = express.Router();

// Public registration route for doctor
doctorRouter.post('/register', registerDoctor);
doctorRouter.get('/profile', auth('doctor'), getDoctorProfile);
doctorRouter.post('/set-availability', auth('doctor'), setAvailability);
doctorRouter.get('/appointments', auth('doctor'), getDoctorAppointments);
doctorRouter.get('/:id/availability', getDoctorAvailabilityById); // 🔥 new route

export default doctorRouter;
