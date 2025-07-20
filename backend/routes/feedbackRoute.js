import express from "express";
import { submitFeedback } from "../controller/feedbackController.js";

const router = express.Router();

router.post("/", submitFeedback);

export default router;