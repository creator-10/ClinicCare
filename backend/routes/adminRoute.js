const express = require('express');
const {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getApprovedDoctors,
} = require('../controller/adminController');
const router = express.Router();

router.get('/doctors/pending', getPendingDoctors);
router.post('/doctors/:id/approve', approveDoctor);
router.delete('/doctors/:id', rejectDoctor);
router.get('/doctors/list', getApprovedDoctors);

module.exports = router;