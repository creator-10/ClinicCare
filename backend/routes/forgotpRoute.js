// backend/routes/forgotpRoute.js

import express from "express";
import {
  verifyEmail,
  verifyPatientId,
  resetPassword
} from "../controller/forgotpController.js";

const router = express.Router();

// Ensure routes match frontend paths
router.post("/verify-email", verifyEmail);
router.post("/verify-patient-id", verifyPatientId);
router.post("/reset-password", resetPassword);

export default router;
