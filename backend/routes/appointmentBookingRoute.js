// routes/appointmentBookingRoute.js
import express from 'express';
import { submitAppointment } from '../controllers/appointmentBookingController.js';

const router = express.Router();

// POST /api/appointment/submit
router.post('/submit', submitAppointment);

export default router;
