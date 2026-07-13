import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";
import { formatDate } from "../utils/formatDate.js";
import { analyzeResume, automaticReviewStatus } from "../utils/resumeAnalysis.js";

function profileView(user, resume) {
  const analysis = resume ? analyzeResume(resume) : null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.professionalRole || "",
    location: user.location || "",
    joined: formatDate(user.createdAt),
    resumeScore: analysis?.score || 0,
    resumeLabel: analysis?.label || "No resume",
    skills: user.skills || "",
  };
}

function jobView(job, match = 0) {
  return {
    id: job._id,
    title: job.title,
    company: job.company,
    logo: job.logo,
    location: job.location,
    salary: job.salary,
    skills: job.skills,
    match,
    type: job.type,
    posted: formatDate(job.createdAt),
    status: job.status,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    benefits: job.benefits,
    applyBy: job.applyBy,
  };
}

function normalize(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim();
}

function words(value = "") {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function skillList(value = "") {
  return value
    .split(/[,;\n]/)
    .map((skill) => normalize(skill))
    .filter(Boolean);
}

function calculateJobMatch(job, user) {
  const targetTitle = normalize(user.professionalRole);
  const targetTitleWords = words(user.professionalRole);
  const jobTitle = normalize(job.title);
  const jobTitleWords = new Set(words(job.title));
  const userSkills = new Set(skillList(user.skills));
  const requiredSkills = skillList(job.skills);

  if (!targetTitle || userSkills.size === 0 || requiredSkills.length === 0) {
    return 0;
  }

  const titleRatio =
    jobTitle.includes(targetTitle) || targetTitle.includes(jobTitle)
      ? 1
      : targetTitleWords.filter((word) => jobTitleWords.has(word)).length /
        targetTitleWords.length;
  const matchedSkillCount = requiredSkills.filter((skill) =>
    userSkills.has(skill),
  ).length;

  if (titleRatio === 0 || matchedSkillCount === 0) {
    return 0;
  }

  const skillRatio = matchedSkillCount / requiredSkills.length;
  return Math.round((titleRatio + skillRatio) * 50);
}

function applicationView(application, jobDetails = null) {
  return {
    id: application._id,
    title: application.job,
    company: application.company,
    logo: application.company
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join(""),
    location: application.location,
    applied: formatDate(application.createdAt),
    status: application.status,
    jobDetails: jobDetails ? jobView(jobDetails) : null,
  };
}

function resumeView(resume, user) {
  const analysis = resume ? analyzeResume(resume) : null;
  return {
    id: resume?._id || "",
    summary: resume?.summary || "",
    experience: resume?.experience ? JSON.parse(resume.experience) : [],
    education: resume?.education || "",
    projects: Array.isArray(resume?.projects) ? resume.projects : [],
    skills: resume?.skills || "",
    softSkills: resume?.softSkills || "",
    fullName: user.name,
    contactEmail: user.email,
    phone: resume?.phone || "",
    location: resume?.location || user.location || "",
    portfolio: resume?.portfolio || "",
    github: resume?.github || "",
    educationEntries: resume?.educationEntries?.length
      ? resume.educationEntries
      : resume?.education
        ? [{ degree: resume.education }]
        : [],
    certifications: resume?.certifications || [],
    awards: resume?.awards || [],
    score: analysis?.score || 0,
    analysis,
    role: user.professionalRole || "",
    status: resume
      ? resume.status === "Pending"
        ? automaticReviewStatus(analysis.score)
        : resume.status
      : "Pending",
  };
}

async function findUserResume(user) {
  const resumeByUser = await Resume.findOne({ user: user._id });
  return resumeByUser || Resume.findOne({ email: user.email });
}

function reviewHistoryView(resume) {
  if (!resume) return [];

  const currentAnalysis = analyzeResume(resume);
  const storedHistory = Array.isArray(resume.reviewHistory) && resume.reviewHistory.length
    ? resume.reviewHistory
    : [{
        reviewedAt: resume.updatedAt || resume.createdAt,
        score: currentAnalysis.score,
        label: currentAnalysis.label,
        status: resume.status === "Pending"
          ? automaticReviewStatus(currentAnalysis.score)
          : resume.status,
        recommendations: currentAnalysis.recommendations,
      }];
  const reviews = storedHistory
    .map((review, index) => {
      const score = Number(review.score) || 0;
      const recommendations = Array.isArray(review.recommendations) && review.recommendations.length
        ? review.recommendations
        : [{
            title: "Tailor each application",
            message: "This review found no major missing sections. Keep tailoring your summary and skills to each job description and preserve measurable evidence of your results.",
          }];

      return {
        id: `${new Date(review.reviewedAt || resume.updatedAt).getTime()}-${index}`,
        title: `Review ${index + 1}`,
        reviewedAt: review.reviewedAt || resume.updatedAt,
        reviewedDate: formatDate(review.reviewedAt || resume.updatedAt),
        score,
        label: review.label || "Needs improvement",
        status: review.status || automaticReviewStatus(score),
        recommendations,
      };
    })
    .reverse();

  if (reviews.length && resume.revisionNotes) {
    reviews[0].recommendations = [
      ...reviews[0].recommendations,
      ...resume.revisionNotes
        .split("\n")
        .map((message) => message.trim())
        .filter(Boolean)
        .map((message) => ({ title: "Reviewer note", message })),
    ];
  }

  return reviews;
}

export async function getUserDashboard(req, res, next) {
  try {
    const [resume, jobs, applications] = await Promise.all([
      findUserResume(req.user),
      Job.find({ status: "Open" }).sort({ createdAt: -1 }),
      Application.find({ email: req.user.email }).sort({ createdAt: -1 }),
    ]);

    const jobMatches = jobs
      .map((job) => ({ job, match: calculateJobMatch(job, req.user) }))
      .filter(({ match }) => match > 0)
      .sort((first, second) => second.match - first.match)
      .map(({ job, match }) => jobView(job, match));

    return res.json({
      success: true,
      profile: profileView(req.user, resume),
      jobMatches,
      applications: applications.map(applicationView),
      resumeReviews: reviewHistoryView(resume),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUserProfile(req, res, next) {
  try {
    const resume = await findUserResume(req.user);
    return res.json({ success: true, profile: profileView(req.user, resume) });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserProfile(req, res, next) {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email) {
      res.status(400);
      throw new Error("Name and email cannot be empty");
    }

    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });

    if (existingUser) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const user = await User.findById(req.user._id);
    user.name = name;
    user.email = email;
    user.professionalRole = req.body.role || "";
    user.location = req.body.location || "";
    user.skills = req.body.skills || "";
    await user.save();

    const resume = await findUserResume(user);
    return res.json({ success: true, profile: profileView(user, resume) });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserPassword(req, res, next) {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      res.status(400);
      throw new Error("All password fields are required");
    }

    if (newPassword !== confirmNewPassword) {
      res.status(400);
      throw new Error("New passwords do not match");
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(oldPassword))) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return next(error);
  }
}

export async function getUserJobs(req, res, next) {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.json({ success: true, jobs: jobs.map(jobView) });
  } catch (error) {
    return next(error);
  }
}

export async function applyToJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    if (job.status !== "Open") {
      res.status(400);
      throw new Error("This job is closed");
    }

    const resume = await findUserResume(req.user);

    if (!resume) {
      res.status(400);
      throw new Error("Please create and save your resume before applying");
    }

    const existing = await Application.findOne({ email: req.user.email, job: job.title, company: job.company });

    if (existing) {
      if (!existing.jobId) {
        existing.jobId = job._id;
        await existing.save();
      }
      return res.json({ success: true, application: applicationView(existing, job) });
    }

    const application = await Application.create({
      jobId: job._id,
      applicant: req.user.name,
      email: req.user.email,
      job: job.title,
      company: job.company,
      location: job.location,
      status: "Pending",
    });

    job.applicants += 1;
    await job.save();

    return res.status(201).json({ success: true, application: applicationView(application, job) });
  } catch (error) {
    return next(error);
  }
}

export async function getUserApplications(req, res, next) {
  try {
    const [applications, jobs] = await Promise.all([
      Application.find({ email: req.user.email }).sort({ createdAt: -1 }),
      Job.find(),
    ]);
    const applicationViews = applications.map((application) => {
      const job = jobs.find(
        (item) =>
          (application.jobId && item._id.equals(application.jobId)) ||
          (item.title === application.job &&
            item.company === application.company),
      );
      return applicationView(application, job);
    });
    return res.json({ success: true, applications: applicationViews });
  } catch (error) {
    return next(error);
  }
}

export async function getUserResume(req, res, next) {
  try {
    const resume = await findUserResume(req.user);
    return res.json({ success: true, resume: resumeView(resume, req.user), profile: profileView(req.user, resume) });
  } catch (error) {
    return next(error);
  }
}

export async function saveUserResume(req, res, next) {
  try {
    const payload = {
      user: req.user._id,
      candidate: req.user.name,
      email: req.user.email,
      contactEmail: req.user.email,
      phone: req.body.phone || "",
      location: req.body.location || "",
      portfolio: req.body.portfolio || "",
      github: req.body.github || "",
      role: req.user.professionalRole || "Not specified",
      status: "Pending",
      summary: req.body.summary || "",
      skills: req.body.skills || "",
      softSkills: req.body.softSkills || "",
      projects: Array.isArray(req.body.projects)
        ? req.body.projects.filter(Boolean)
        : [],
      experience: JSON.stringify(req.body.experience || []),
      education: req.body.education?.[0]?.degree || "",
      educationEntries: Array.isArray(req.body.education)
        ? req.body.education
        : [],
      certifications: Array.isArray(req.body.certifications)
        ? req.body.certifications.filter(Boolean)
        : [],
      awards: Array.isArray(req.body.awards)
        ? req.body.awards.filter(Boolean)
        : [],
    };
    const analysis = analyzeResume(payload);
    payload.score = analysis.score;
    payload.analysis = analysis;
    payload.status = automaticReviewStatus(analysis.score);
    let resume = await findUserResume(req.user);
    const reviewEntry = {
      reviewedAt: new Date(),
      score: analysis.score,
      label: analysis.label,
      status: payload.status,
      recommendations: analysis.recommendations,
    };
    payload.reviewHistory = resume?.reviewHistory?.length
      ? [...resume.reviewHistory, reviewEntry]
      : [reviewEntry];

    if (resume) {
      Object.assign(resume, payload);
      await resume.save();
    } else {
      resume = await Resume.create(payload);
    }

    return res.json({ success: true, resume: resumeView(resume, req.user) });
  } catch (error) {
    return next(error);
  }
}
