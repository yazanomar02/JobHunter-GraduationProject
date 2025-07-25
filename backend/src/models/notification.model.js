import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    employer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["applicant", "job-status"], required: true },
    message: { type: String, required: true },
    job: { type: Schema.Types.ObjectId, ref: "Job" },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema); 