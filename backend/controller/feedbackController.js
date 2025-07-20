import Feedback from "../models/feedbackModel.js";

// Email regex for validation
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, services, suggestion } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Name is required." });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }

    const newFeedback = new Feedback({ name, email, services, suggestion });
    await newFeedback.save();

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};