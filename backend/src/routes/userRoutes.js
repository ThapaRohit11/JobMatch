import express from "express";
import {
  applyToJob,
  getUserApplications,
  getUserDashboard,
  getUserJobs,
  getUserProfile,
  getUserResume,
  saveUserResume,
  updateUserPassword,
  updateUserProfile,
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("user"));

router.get("/dashboard", getUserDashboard);
router.route("/profile").get(getUserProfile).put(updateUserProfile);
router.put("/password", updateUserPassword);
router.get("/jobs", getUserJobs);
router.post("/jobs/:id/apply", applyToJob);
router.get("/applications", getUserApplications);
router.route("/resume").get(getUserResume).put(saveUserResume);

export default router;
