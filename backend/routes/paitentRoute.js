// here filename given patientRoute.js but in system routes/userRoute.js
import express from 'express';
import { registerUser, loginUser, profileUser } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js'; 
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, profileUser);

export default router;
