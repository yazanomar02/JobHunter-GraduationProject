import mongoose, { Schema } from "mongoose";

const feedbackMessageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  userName: { type: String, required: false },
  email: { type: String, required: false },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const FeedbackMessage = mongoose.model("FeedbackMessage", feedbackMessageSchema); 