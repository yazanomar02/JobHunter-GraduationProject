import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { connectDB } from "./db.js";

dotenv.config({ path: "../../.env" });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jobhunter.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";

async function seedAdmin() {
  await connectDB();
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin already exists:", existingAdmin.email);
    process.exit(0);
  }
  const admin = await User.create({
    username: "admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
    userProfile: {},
  });
  console.log("Admin created:", admin.email);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
}); 