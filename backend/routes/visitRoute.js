// routes/visitRoute.js
import express from "express";
import {
  createVisit,
  getAllVisits,
  getVisitById,
  getVisitByAppointmentId,
  getRecentVisits,
 
} from "../controller/visitController.js";

import auth from "../middlewares/authUser.js";

const router = express.Router();

router.post("/", auth("doctor"), createVisit);
router.get("/", auth("doctor"), getAllVisits);
router.get("/recent", auth("doctor"), getRecentVisits);
router.get("/appointment/:appointmentId", auth(), getVisitByAppointmentId);
router.get("/:id", auth("doctor"), getVisitById);



export default router;
