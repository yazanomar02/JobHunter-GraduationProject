import { Router } from "express";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";
import { CompanyProfile } from "../models/companyProfile.model.js";
import { Job } from "../models/job.model.js";
import { FeedbackMessage } from "../models/feedbackMessage.model.js";

const router = Router();

// مسار تجريبي: فقط الـ Admin يمكنه الوصول إليه
router.get("/ping", verifyJWT, isAdmin, (req, res) => {
  res.json({ message: "Hello Admin! Access granted." });
});

// جلب كل المستخدمين
router.get("/users", verifyJWT, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// حذف مستخدم
router.delete("/users/:id", verifyJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  if (req.user._id.toString() === id) {
    return res.status(400).json({ message: "لا يمكن حذف حساب Admin الحالي." });
  }
  await User.findByIdAndDelete(id);
  res.json({ message: "تم حذف المستخدم بنجاح." });
});

// ترقية مستخدم إلى Admin
router.patch("/users/:id/promote", verifyJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });
  user.role = "admin";
  await user.save();
  res.json({ message: "تمت ترقية المستخدم إلى Admin." });
});

// جلب كل الشركات (من users حيث يوجد userProfile.companyName)
router.get("/companies", verifyJWT, isAdmin, async (req, res) => {
  const companies = await User.find(
    { "userProfile.companyName": { $exists: true, $ne: null } },
    { username: 1, email: 1, userProfile: 1, createdAt: 1 }
  );
  res.json(companies);
});

// حذف شركة
router.delete("/companies/:id", verifyJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  await CompanyProfile.findByIdAndDelete(id);
  res.json({ message: "تم حذف الشركة بنجاح." });
});

// جلب كل الوظائف
router.get("/jobs", verifyJWT, isAdmin, async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

// حذف وظيفة
router.delete("/jobs/:id", verifyJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  await Job.findByIdAndDelete(id);
  res.json({ message: "تم حذف الوظيفة بنجاح." });
});

// جلب كل رسائل feedback
router.get("/feedback", verifyJWT, isAdmin, async (req, res) => {
  const feedbacks = await FeedbackMessage.find();
  res.json(feedbacks);
});

// حذف رسالة feedback
router.delete("/feedback/:id", verifyJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  await FeedbackMessage.findByIdAndDelete(id);
  res.json({ message: "تم حذف رسالة feedback بنجاح." });
});

// Simple Admin statistics endpoint
router.get("/stats", verifyJWT, isAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const companiesCount = await CompanyProfile.countDocuments();
    const jobsCount = await Job.countDocuments();
    const feedbackCount = await FeedbackMessage.countDocuments();
    res.json({
      users: usersCount,
      companies: companiesCount,
      jobs: jobsCount,
      feedback: feedbackCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin statistics", error: err.message });
  }
});

export default router; 