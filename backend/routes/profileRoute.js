import express from "express";
import { updateProfile, getProfile } from "../controller/profileController.js";

const router = express.Router();

router.post("/update", updateProfile);
router.get("/:patientId", getProfile);

export default router;