import express from "express";
import {
  applyToJob,
  chatWithAssistantController,
  getUserApplications,
  getAIResumeInsights,
  getUserDashboard,
  getUserJobs,
  getSavedJobs,
  getUserProfile,
  getUserResume,
  saveUserResume,
  saveJob,
  updateUserAvatar,
  updateUserPassword,
  updateUserProfile,
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("user"));

router.get("/dashboard", getUserDashboard);
router.route("/profile").get(getUserProfile).put(updateUserProfile);
router.put("/profile/avatar", updateUserAvatar);
router.put("/password", updateUserPassword);
router.get("/jobs", getUserJobs);
router.get("/saved-jobs", getSavedJobs);
router.put("/jobs/:id/save", saveJob);
router.post("/jobs/:id/apply", applyToJob);
router.get("/applications", getUserApplications);
router.route("/resume").get(getUserResume).put(saveUserResume);
router.get("/resume/ai-insights", getAIResumeInsights);
router.post("/chat", chatWithAssistantController);

export default router;
