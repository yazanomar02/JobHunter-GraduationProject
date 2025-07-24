import { FeedbackMessage } from "../models/feedbackMessage.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// إضافة رسالة feedback
export const createFeedbackMessage = asyncHandler(async (req, res) => {
  const { userId, userName, email, message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const feedback = await FeedbackMessage.create({
    userId,
    userName,
    email,
    message,
  });
  res.status(201).json(new ApiResponse(201, feedback, "Feedback sent successfully"));
});

// جلب كل رسائل feedback
export const getAllFeedbackMessages = asyncHandler(async (req, res) => {
  const feedbacks = await FeedbackMessage.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, feedbacks, "Feedback messages fetched successfully"));
}); 