import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.service.js";
import { JobSeekerProfile } from "../models/jobSeekerProfile.model.js";
import { PRODUCTION_URL } from "../constants.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// Testing endpoints
const ping = (req, res) => {
  res.send("User API is working");
};
const authPing = (req, res) => {
  res.send("User Auth is working");
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  domain:
    process.env.NODE_ENV === "production" ? "noobnarayan.in" : "localhost",
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating referesh and access token: ${error}`
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, userProfile } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const username = email.split("@")[0];
  // تحقق من الدور القادم من الواجهة
  let role = req.body.role;
  if (role !== "employer" && role !== "jobSeeker") {
    throw new ApiError(400, "Invalid role. Only employer or jobSeeker allowed.");
  }
  const user = await User.create({
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    password,
    role,
    userProfile,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // إرسال رسالة ترحيب جميلة
  try {
    await sendEmail({
      to: email,
      subject: "Welcome to JobHunter!",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 40px 0;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 12px #0001; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #16a34a 0%, #22d3ee 100%); padding: 32px 0; text-align: center;">
              <img src='https://i.ibb.co/3kQw1kF/JobHunter-Logo.png' alt='JobHunter' style='width: 64px; border-radius: 12px; margin-bottom: 12px;' />
              <h1 style="color: #fff; margin: 0; font-size: 2.2rem;">Welcome to JobHunter!</h1>
            </div>
            <div style="padding: 32px 24px; text-align: center;">
              <h2 style="color: #16a34a; margin-bottom: 12px;">Hello,</h2>
              <p style="color: #222; font-size: 1.1rem; margin-bottom: 24px;">We're excited to have you join our community! 🚀<br/>Start exploring thousands of jobs and connect with top companies now.</p>
              <div style="margin: 24px 0;">
                <a href="http://localhost:5173/login" style="background: #16a34a; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 1rem; font-weight: bold;">Go to JobHunter</a>
              </div>
              <p style="color: #888; font-size: 0.95rem;">If you have any questions, just reply to this email.<br/>Happy job hunting!<br/><b>JobHunter Team</b></p>
            </div>
          </div>
        </div>
      `
    });
  } catch (err) {
    // لا توقف التسجيل إذا فشل الإرسال
    console.error("[registerUser] Failed to send welcome email:", err);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "User login successful"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetch successful"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "contactNumber",
    "address",
    "dateOfBirth",
    "gender",
    "nationality",
    "savedJobs",
    "profilePicture",
    "resume",
    "certifications",
    "languages",
    "interests",
    "projectExperience",
    "name",
    "location",
    "primaryRole",
    "yearsOfExperience",
    "bio",
    "skills",
    "education",
    "workExperience",
    "applications",
    "socialProfiles",
    "publicProfile",
    "jobPreferences",
    "doneOnboarding",
    "companyName",
    "companyDescription",
    "contactNumber",
    "address",
    "companySize",
    "companyLogo",
    "companySocialProfiles",
  ];
  const nonValidOperations = [];
  const isValidOperation = updates.every((update) => {
    if (allowedUpdates.includes(update)) {
      return true;
    } else {
      nonValidOperations.push(update);
      return false;
    }
  });

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: `Invalid updates! ${nonValidOperations.toString()}` });
  }

  const userProfileUpdates = {};
  updates.forEach(
    (update) => (userProfileUpdates[`userProfile.${update}`] = req.body[update])
  );

  const user = await User.findByIdAndUpdate(req.user._id, userProfileUpdates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return res.status(404).send();
  }

  res.send(user);
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, "Profile Picture file is missing");
  }

  let user = await User.findById(req.user._id);

  let oldProfilePictureUrl = user?.userProfile?.profilePicture;

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
  if (!profilePicture?.url) {
    throw new ApiError(400, "Error while uploading profile picture");
  }

  if (user.role === "jobSeeker") {
    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "userProfile.profilePicture": profilePicture.url,
        },
      },
      { new: true }
    ).select("-password");
  } else if (user.role === "employer") {
    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "userProfile.companyLogo": profilePicture.url,
        },
      },
      { new: true }
    ).select("-password");
  }

  if (
    oldProfilePictureUrl &&
    oldProfilePictureUrl !=
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
  ) {
    try {
      const splitUrl = oldProfilePictureUrl.split("/");
      const filenameWithExtension = splitUrl[splitUrl.length - 1];
      const imageId = filenameWithExtension.split(".")[0];
      const res = await deleteFromCloudinary(imageId);
    } catch (error) {
      throw new ApiError(
        304,
        `Error deleting profile picture: ${error.message}`
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User profile picture updated successfully")
    );
});

const addSkill = asyncHandler(async (req, res) => {
  const { skill } = req.body;
  const { role } = req.user;
  if (role !== "jobSeeker") {
    throw new ApiError(401, "You are not authorized to perform this action");
  }

  if (!skill) {
    throw new ApiError(400, "Skill is required");
  }

  const user = await User.findById(req.user._id);
  user.userProfile.skills.push(skill);
  user.markModified("userProfile.skills");
  await user.save();

  const updatedUser = await User.findById(req.user._id);
  console.log(updatedUser.userProfile.skills);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser.userProfile.skills,
        "Skills updated successfully"
      )
    );
});

const removeSkill = asyncHandler(async (req, res) => {
  const { skill } = req.body;
  const { role } = req.user;
  if (role !== "jobSeeker") {
    throw new ApiError(401, "You are not authorized to perform this action");
  }
  if (!skill) {
    throw new ApiError(400, "Skill is required");
  }

  const user = await User.findById(req.user._id);
  user.userProfile.skills = user.userProfile.skills.filter((s) => s !== skill);
  user.markModified("userProfile.skills");
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Skills removed successfully"));
});

const updateResume = asyncHandler(async (req, res) => {
  const { resume } = req.body;
  const { role } = req.user;
  if (role !== "jobSeeker") {
    throw new ApiError(401, "You are not authorized to perform this action");
  }
  if (!resume) {
    throw new ApiError(400, "Resume is required");
  }

  const user = await User.findById(req.user._id);
  user.userProfile.resume = resume;
  user.markModified("userProfile.resume");
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Resume updated successfully"));
});

const userPublicProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select(
    "email _id userProfile.profilePicture userProfile.address userProfile.bio userProfile.location userProfile.yearsOfExperience userProfile.socialProfiles userProfile.workExperience userProfile.education userProfile.skills userProfile.name userProfile.resume"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetch successful"));
});

// طلب استعادة كلمة المرور (معزول)
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const user = await User.findOne({ email });
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 دقيقة
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your JobHunter password",
        html: `<p>Hello,</p><p>You requested to reset your password. Click the link below to set a new password:</p><p><a href='${resetUrl}'>Reset Password</a></p><p>If you did not request this, just ignore this email.</p>`
      });
    } catch (err) {
      return res.status(500).json({ message: "Failed to send reset email. Please try again later." });
    }
  }
  // لا تكشف إذا كان الإيميل غير موجود
  return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
});

// إعادة تعيين كلمة المرور (معزول)
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "Token and new password are required" });
  }
  const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return res.status(200).json({ message: "Password reset successfully" });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required" });
  }
  const user = await User.findById(req.user._id).select("password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await user.isPasswordCorrect(currentPassword);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json({ message: "Password changed successfully" });
});

export {
  ping,
  authPing,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  addSkill,
  removeSkill,
  updateResume,
  userPublicProfile,
};
