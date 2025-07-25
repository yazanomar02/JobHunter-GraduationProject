import mongoose, { Schema } from "mongoose";

const jobApplicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model("JobApplication", jobApplicationSchema); 