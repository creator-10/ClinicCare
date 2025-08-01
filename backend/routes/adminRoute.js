import express from 'express';
import {
  loginAdmin,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getDoctorsList
} from '../controller/adminController.js';
import auth from '../middlewares/authUser.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/doctors/pending', auth('admin'), getPendingDoctors);
router.post('/doctors/:id/approve', auth('admin'), approveDoctor);
router.delete('/doctors/:id', auth('admin'), rejectDoctor);
router.get('/doctors/list',getDoctorsList);

export default router;
