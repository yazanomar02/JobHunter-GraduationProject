import express from "express";
import { createFeedbackMessage, getAllFeedbackMessages } from "../controllers/feedback.controller.js";

const router = express.Router();

// إرسال feedback
router.post("/", createFeedbackMessage);
// جلب كل feedback
router.get("/", getAllFeedbackMessages);

export default router; 