import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";
import { formatDate } from "../utils/formatDate.js";
import { analyzeResume, automaticReviewStatus } from "../utils/resumeAnalysis.js";

function jobView(job) {
  return {
    id: job._id,
    title: job.title,
    company: job.company,
    logo: job.logo,
    location: job.location,
    salary: job.salary,
    skills: job.skills,
    type: job.type,
    applyBy: job.applyBy,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    benefits: job.benefits,
    applicants: job.applicants,
    posted: formatDate(job.createdAt),
    status: job.status,
  };
}

function companyView(company, jobs = []) {
  return {
    id: company._id,
    name: company.name,
    logo: company.logo,
    industry: company.industry,
    location: company.location,
    jobs: jobs.filter((job) => job.company === company.name && job.status === "Open").length,
  };
}

function experienceView(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [{ role: "", company: "", period: "", location: "", detail: value }];
  }
}

function resumeView(resume) {
  const analysis = analyzeResume(resume);
  const status = resume.status === "Pending"
    ? automaticReviewStatus(analysis.score)
    : resume.status;
  return {
    id: resume._id,
    candidate: resume.candidate,
    email: resume.email,
    uploaded: formatDate(resume.createdAt),
    updated: formatDate(resume.updatedAt),
    score: String(analysis.score),
    analysis,
    role: resume.role,
    status,
    revisionNotes: resume.revisionNotes,
    contactEmail: resume.contactEmail || resume.email,
    phone: resume.phone,
    location: resume.location,
    portfolio: resume.portfolio,
    github: resume.github,
    summary: resume.summary,
    skills: resume.skills,
    softSkills: resume.softSkills,
    projects: resume.projects || [],
    experience: experienceView(resume.experience),
    education: resume.education,
    educationEntries: resume.educationEntries?.length
      ? resume.educationEntries
      : resume.education
        ? [{ degree: resume.education }]
        : [],
    certifications: resume.certifications || [],
    awards: resume.awards || [],
  };
}

function applicationView(application) {
  return {
    id: application._id,
    applicant: application.applicant,
    email: application.email,
    job: application.job,
    company: application.company,
    location: application.location,
    date: formatDate(application.createdAt),
    status: application.status,
  };
}

function userView(user, applications = [], resumes = []) {
  const userApplications = applications.filter((application) => application.email === user.email);
  const resume = resumes.find(
    (item) =>
      item.user?.toString() === user._id.toString() ||
      item.email === user.email,
  );

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    location: user.location || "Not set",
    role: user.professionalRole || "Candidate",
    skills: user.skills || "",
    applied: userApplications.length,
    accepted: userApplications.filter((application) => application.status === "Accepted").length,
    rejected: userApplications.filter((application) => application.status === "Rejected").length,
    resumeScore: resume ? analyzeResume(resume).score : 0,
    resumeLabel: resume ? analyzeResume(resume).label : "No resume",
    avatarColor: "bg-blue-600",
    status: "Active",
    joined: formatDate(user.createdAt),
    applications: userApplications
      .sort((first, second) => second.createdAt - first.createdAt)
      .map(applicationView),
    resume: resume ? resumeView(resume) : null,
  };
}

export async function getDashboard(req, res, next) {
  try {
    const [users, jobs, applications] = await Promise.all([
      User.find({ role: "user" }),
      Job.find().sort({ createdAt: -1 }),
      Application.find().sort({ createdAt: -1 }),
    ]);

    return res.json({
      success: true,
      stats: [
        { label: "Total Users", value: String(users.length), detail: `${users.slice(0, 5).length} recent candidate accounts` },
        { label: "Total Jobs", value: String(jobs.length), detail: `${jobs.filter((job) => job.status === "Open").length} currently open` },
        { label: "Total Applications", value: String(applications.length), detail: `${applications.filter((application) => application.status === "Pending").length} pending review` },
      ],
      recentJobPosts: jobs.slice(0, 5).map((job) => `${job.company} posted ${job.title}.`),
      recentApplications: applications.slice(0, 5).map((application) => `${application.applicant} applied for ${application.job} at ${application.company}.`),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getJobs(req, res, next) {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.json({ success: true, jobs: jobs.map(jobView) });
  } catch (error) {
    return next(error);
  }
}

export async function createJob(req, res, next) {
  try {
    const { title, company, salary, type } = req.body;

    if (!title?.trim() || !company?.trim() || !salary?.trim() || !type?.trim()) {
      res.status(400);
      throw new Error("Job title, company, salary, and type are required");
    }

    const selectedCompany = await Company.findOne({ name: company });

    if (!selectedCompany) {
      res.status(404);
      throw new Error("Company not found");
    }

    const job = await Job.create({
      ...req.body,
      company: selectedCompany.name,
      logo: selectedCompany.logo,
      location: selectedCompany.location,
    });

    return res.status(201).json({ success: true, job: jobView(job) });
  } catch (error) {
    return next(error);
  }
}

export async function updateJob(req, res, next) {
  try {
    const selectedCompany = await Company.findOne({ name: req.body.company });
    const payload = selectedCompany
      ? { ...req.body, company: selectedCompany.name, logo: selectedCompany.logo, location: selectedCompany.location }
      : req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    return res.json({ success: true, job: jobView(job) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    return res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    return next(error);
  }
}

export async function getCompanies(req, res, next) {
  try {
    const [companies, jobs] = await Promise.all([Company.find().sort({ createdAt: -1 }), Job.find()]);
    return res.json({ success: true, companies: companies.map((company) => companyView(company, jobs)) });
  } catch (error) {
    return next(error);
  }
}

export async function createCompany(req, res, next) {
  try {
    const { name, industry, location } = req.body;

    if (!name?.trim() || !industry?.trim() || !location?.trim()) {
      res.status(400);
      throw new Error("Company name, industry, and location are required");
    }

    const logo = name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
    const company = await Company.create({ name, industry, location, logo });
    return res.status(201).json({ success: true, company: companyView(company) });
  } catch (error) {
    return next(error);
  }
}

export async function updateCompany(req, res, next) {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    return res.json({ success: true, company: companyView(company) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCompany(req, res, next) {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    return res.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    return next(error);
  }
}

export async function getApplications(req, res, next) {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.json({ success: true, applications: applications.map(applicationView) });
  } catch (error) {
    return next(error);
  }
}

export async function updateApplication(req, res, next) {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    return res.json({ success: true, application: applicationView(application) });
  } catch (error) {
    return next(error);
  }
}

export async function getResumes(req, res, next) {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    await Promise.all(
      resumes
        .filter((resume) => resume.status === "Pending")
        .map((resume) => {
          const analysis = analyzeResume(resume);
          resume.score = analysis.score;
          resume.analysis = analysis;
          resume.status = automaticReviewStatus(analysis.score);
          return resume.save();
        }),
    );
    return res.json({ success: true, resumes: resumes.map(resumeView) });
  } catch (error) {
    return next(error);
  }
}

export async function updateResume(req, res, next) {
  try {
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, revisionNotes: req.body.revisionNotes || "" },
      { new: true, runValidators: true }
    );

    if (!resume) {
      res.status(404);
      throw new Error("Resume not found");
    }

    return res.json({ success: true, resume: resumeView(resume) });
  } catch (error) {
    return next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const [users, applications, resumes] = await Promise.all([
      User.find({ role: "user" }).sort({ createdAt: -1 }),
      Application.find(),
      Resume.find(),
    ]);

    return res.json({ success: true, users: users.map((user) => userView(user, applications, resumes)) });
  } catch (error) {
    return next(error);
  }
}
