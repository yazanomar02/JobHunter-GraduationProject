import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
const getAllJobListings = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    if (role !== "employer") {
        throw new ApiError(
            401,
            "Unauthorized request, only employers are allowed"
        );
    }

    const jobListings = await Job.find({
        employer: _id,
    });
    if (!jobListings) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "No job listings found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                jobListings,
                "Job listings fetched successfully"
            )
        );
});
const getActiveJobListings = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    if (role !== "employer") {
        throw new ApiError(
            401,
            "Unauthorized request, only employers are allowed"
        );
    }
    const jobListings = await Job.find({
        employer: _id,
        active: true,
    });
    if (!jobListings) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "No job listings found"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                jobListings,
                "successfully fetched active job listings"
            )
        );
});

const getNonActiveJobListings = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    if (role !== "employer") {
        throw new ApiError(
            401,
            "Unauthorized request, only employers are allowed"
        );
    }
    const jobListings = await Job.find({
        employer: _id,
        active: false,
    });
    if (!jobListings) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "No job listings found"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                jobListings,
                "Succfully fetched non-active job listings"
            )
        );
});

const getAllApplications = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    if (role !== "employer") {
        throw new ApiError(
            401,
            "Unauthorized request, only employers are allowed"
        );
    }
    const applicants = await Job.aggregate([
        {
            $match: {
                employer: _id,
            },
        },
        {
            $match: {
                "applicants.0": { $exists: true },
            },
        },
        {
            $unwind: "$applicants",
        },
        {
            $project: {
                _id: 1,
                applicant: "$applicants",
                job: "$_id",
            },
        },
    ]);

    let final = [];

    for (const application of applicants) {
        const applicantId = application.applicant;
        const jobId = application.job;

        const applicatProfilePromise = User.findById(applicantId)
            .select(
                "_id email userProfile.profilePicture userProfile.address userProfile.bio userProfile.location userProfile.yearsOfExperience userProfile.socialProfiles userProfile.workExperience userProfile.education userProfile.skills userProfile.name userProfile.resume "
            )
            .exec();
        const jobDetailsPromise = Job.findById(jobId)
            .select("_id title")
            .exec();

        const [applicantProfile, jobDetails] = await Promise.all([
            applicatProfilePromise,
            jobDetailsPromise,
        ]);

        final.push({ applicantProfile, jobDetails });
    }

    if (!final || final.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "No job listings found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, final, "Job listings fetched successfully"));
});

const getShortListedCandidates = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    if (role !== "employer") {
        throw new ApiError(
            401,
            "Unauthorized request, only employers are allowed"
        );
    }
    const shortlistedCandidates = await Job.aggregate([
        {
            $match: {
                employer: _id,
            },
        },
        {
            $match: {
                "shortlistedCandidates.0": { $exists: true },
            },
        },
        {
            $unwind: "$shortlistedCandidates",
        },
        {
            $project: {
                _id: 1,
                applicant: "$shortlistedCandidates",
                job: "$_id",
            },
        },
    ]);

    let final = [];

    for (const application of shortlistedCandidates) {
        const applicantId = application.applicant;
        const jobId = application.job;

        const applicatProfilePromise = User.findById(applicantId)
            .select(
                "_id email userProfile.profilePicture userProfile.address userProfile.bio userProfile.location userProfile.yearsOfExperience userProfile.socialProfiles userProfile.workExperience userProfile.education userProfile.skills userProfile.name userProfile.resume "
            )
            .exec();
        const jobDetailsPromise = Job.findById(jobId)
            .select("_id title")
            .exec();

        const [applicantProfile, jobDetails] = await Promise.all([
            applicatProfilePromise,
            jobDetailsPromise,
        ]);

        final.push({ applicantProfile, jobDetails });
    }

    if (!final || final.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "No job listings found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, final, "Job listings fetched successfully"));
});

const removeFromApplications = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    if (role !== "employer") {
        throw new ApiError(
            401,
            "Unauthorized request, only employers are allowed"
        );
    }

    const { jobId, applicantId } = req.body;

    const job = await Job.findByIdAndUpdate(
        jobId,
        {
            $pull: {
                applicants: applicantId,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Applicant has been successfully removed from the job application."
            )
        );
});

const shortlistCandidate = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    if (role !== "employer") {
        throw new ApiError(
            401,
            "Unauthorized request, only employers are allowed"
        );
    }
    const { jobId, applicantId } = req.body;

    const job = await Job.findByIdAndUpdate(
        jobId,
        {
            $addToSet: {
                shortlistedCandidates: applicantId,
            },
            $pull: {
                applicants: applicantId,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                job,
                "Applicant has been successfully shortlisted and removed from the job application."
            )
        );
});

const removeFromShortlist = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    if (role !== "employer") {
        throw new ApiError(
            401,
            "Unauthorized request, only employers are allowed"
        );
    }
    const { jobId, applicantId } = req.body;

    const job = await Job.findByIdAndUpdate(
        jobId,
        {
            $pull: {
                shortlistedCandidates: applicantId,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Applicant has been successfully removed from shortlist."
            )
        );
});

const getCompanyById = asyncHandler(async (req, res) => {
    const companyId = req.params.id;
    const company = await User.findOne({ _id: companyId, role: "employer" }).select("email _id userProfile");
    if (!company) {
        throw new ApiError(404, "Company not found");
    }
    // جلب تفاصيل الوظائف النشطة فقط
    let jobListings = [];
    if (company.userProfile?.jobListings?.length) {
        jobListings = await Job.find({
            _id: { $in: company.userProfile.jobListings },
            active: true,
        }).select("title location description active");
    }
    // دمج تفاصيل الوظائف في userProfile
    const companyObj = company.toObject();
    companyObj.userProfile.jobListings = jobListings;
    return res.status(200).json(new ApiResponse(200, companyObj, "Company profile fetched successfully"));
});

const updateCompanyProfile = asyncHandler(async (req, res) => {
    const { role, _id } = req.user;
    console.log('updateCompanyProfile:', { role, _id, body: req.body });
    if (role !== "employer") {
        throw new ApiError(403, "Only employers are authorized to update company profile");
    }
    const allowedUpdates = [
        "companyName", "companyDescription", "contactNumber", "address", "industry", "companySize", "companyLogo", "companyWebsite", "companySocialProfiles", "employeeBenefits", "aiUseLimit"
    ];
    const updates = Object.keys(req.body);
    console.log('updates:', updates);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    console.log('isValidOperation:', isValidOperation);
    if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid updates! Allowed: " + allowedUpdates.join(", ") + ". Sent: " + updates.join(", ") });
    }
    const updateObj = {};
    updates.forEach((update) => {
        updateObj[`userProfile.${update}`] = req.body[update];
    });
    const company = await User.findByIdAndUpdate(_id, updateObj, { new: true, runValidators: true }).select("-password");
    if (!company) {
        return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(new ApiResponse(200, company, "Company profile updated successfully"));
});

// جلب إشعارات الشركة (حقيقي)
export const getCompanyNotifications = async (req, res) => {
  const employerId = req.user._id;
  const notifications = await Notification.find({ employer: employerId })
    .sort({ createdAt: -1 })
    .lean();
  res.json(notifications.map(n => ({
    id: n._id,
    type: n.type,
    message: n.message,
    job: n.job,
    date: n.createdAt,
    read: n.read,
  })));
};

// جلب رسائل المتقدمين (حقيقي)
export const getApplicantMessages = async (req, res) => {
  const employerId = req.user._id;
  // جلب كل الوظائف التي يملكها هذا المستخدم
  const jobs = await Job.find({ employer: employerId }).select("_id title").lean();
  const jobIds = jobs.map(j => j._id);
  const jobTitles = Object.fromEntries(jobs.map(j => [j._id.toString(), j.title]));
  // جلب كل طلبات التقديم لهذه الوظائف
  const applications = await JobApplication.find({ job: { $in: jobIds } })
    .populate("applicant", "userProfile.name userProfile.profilePicture username email")
    .sort({ createdAt: -1 })
    .lean();
  res.json(applications.map(app => ({
    id: app._id,
    applicantName: app.applicant?.userProfile?.name || app.applicant?.username || "Anonymous",
    applicantAvatar: app.applicant?.userProfile?.profilePicture || "",
    jobTitle: jobTitles[app.job.toString()] || "",
    message: app.coverLetter,
    date: app.createdAt,
  })));
};

export {
    getAllJobListings,
    getAllApplications,
    getActiveJobListings,
    getNonActiveJobListings,
    getShortListedCandidates,
    removeFromApplications,
    shortlistCandidate,
    removeFromShortlist,
    getCompanyById,
    updateCompanyProfile,
};
