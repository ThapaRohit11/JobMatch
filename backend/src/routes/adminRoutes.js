import express from "express";
import {
  createCompany,
  createJob,
  deleteCompany,
  deleteJob,
  getApplications,
  getCompanies,
  getDashboard,
  getJobs,
  getResumes,
  getUsers,
  updateApplication,
  updateCompany,
  updateJob,
  updateResume,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);

router.route("/jobs").get(getJobs).post(createJob);
router.route("/jobs/:id").put(updateJob).delete(deleteJob);

router.route("/companies").get(getCompanies).post(createCompany);
router.route("/companies/:id").put(updateCompany).delete(deleteCompany);

router.get("/applications", getApplications);
router.put("/applications/:id", updateApplication);

router.get("/resumes", getResumes);
router.put("/resumes/:id", updateResume);

export default router;
