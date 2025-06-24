const express = require('express');
const router = express.Router();
const visitController = require('../controller/visitController');
const auth = require('../middlewares/authUser');

// All routes protected for doctors (or adjust as needed)
router.post('/', auth('doctor'), visitController.createVisit);
router.get('/all', auth(), visitController.getAllVisits);
router.get('/recent', auth(), visitController.getRecentVisits); // <-- Add this line
router.get('/:appointmentId', auth(), visitController.getVisitByAppointmentId);

module.exports = router;