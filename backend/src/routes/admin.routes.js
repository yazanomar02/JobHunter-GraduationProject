import { Router } from "express";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";
import { CompanyProfile } from "../models/companyProfile.model.js";
import { Job } from "../models/job.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
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
  
  try {
    // التحقق من نوع المستخدم
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود." });
    }
    
    // إذا كان المستخدم أدمن، تحقق من عدد الأدمنات
    if (user.role === "admin") {
      const adminsCount = await User.countDocuments({ role: "admin" });
      if (adminsCount <= 1) {
        return res.status(400).json({ message: "لا يمكن حذف آخر أدمن في النظام." });
      }
    }
    
    // إذا كان المستخدم صاحب عمل، احذف جميع وظائفه وطلباتها أولاً
    if (user.role === "employer") {
      const jobs = await Job.find({ employer: id });
      const jobIds = jobs.map(job => job._id);
      await JobApplication.deleteMany({ job: { $in: jobIds } });
      await Job.deleteMany({ employer: id });
    }
    
    // حذف المستخدم
    await User.findByIdAndDelete(id);
    
    const message = user.role === "employer" 
      ? "تم حذف الشركة وجميع وظائفها بنجاح." 
      : "تم حذف المستخدم بنجاح.";
      
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: "فشل في حذف المستخدم", error: error.message });
  }
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
  
  try {
    // حذف جميع طلبات التوظيف المرتبطة بجميع وظائف الشركة أولاً
    const jobs = await Job.find({ employer: id });
    const jobIds = jobs.map(job => job._id);
    await JobApplication.deleteMany({ job: { $in: jobIds } });
    
    // حذف جميع الوظائف المرتبطة بالشركة
    await Job.deleteMany({ employer: id });
    
    // حذف الشركة (User مع role = "employer")
    await User.findByIdAndDelete(id);
    
    res.json({ message: "تم حذف الشركة وجميع وظائفها وطلباتها بنجاح." });
  } catch (error) {
    res.status(500).json({ message: "فشل في حذف الشركة", error: error.message });
  }
});

// جلب كل الوظائف
router.get("/jobs", verifyJWT, isAdmin, async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

// حذف وظيفة
router.delete("/jobs/:id", verifyJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    // حذف جميع طلبات التوظيف المرتبطة بالوظيفة أولاً
    await JobApplication.deleteMany({ job: id });
    
    // حذف الوظيفة
    await Job.findByIdAndDelete(id);
    
    res.json({ message: "تم حذف الوظيفة وجميع طلباتها بنجاح." });
  } catch (error) {
    res.status(500).json({ message: "فشل في حذف الوظيفة", error: error.message });
  }
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

// جلب عدد الأدمنات
router.get("/admins-count", verifyJWT, isAdmin, async (req, res) => {
  try {
    const adminsCount = await User.countDocuments({ role: "admin" });
    res.json({ adminsCount });
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب عدد الأدمنات", error: err.message });
  }
});

// Simple Admin statistics endpoint
router.get("/stats", verifyJWT, isAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    // عد الشركات بنفس منطق صفحة العرض
    const companiesCount = await User.countDocuments({
      role: "employer",
      "userProfile.doneOnboarding": true
    });
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