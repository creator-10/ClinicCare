import express from "express";
import {
  submitAppointment,
  getAppointmentsForPatient,
  deleteAppointmentById,
} from "../controller/appointmentController.js"; 

const router = express.Router();

router.post("/", submitAppointment);
router.get("/patient/:patientId", getAppointmentsForPatient);
router.delete("/:id", deleteAppointmentById);

export default router;
