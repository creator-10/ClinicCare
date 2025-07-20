import express from 'express';
import {
  getAppointmentsPerDay,
  getVisitsPerSpecialization
} from '../controller/chartController.js';

const router = express.Router();

router.get('/stats/daily', getAppointmentsPerDay);
router.get('/stats/specialization', getVisitsPerSpecialization);

export default router;
