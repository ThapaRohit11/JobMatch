import express from "express";
import {
  getMe,
  login,
  signup,
  updateAdminPassword,
  updateAdminProfile,
} from "../controllers/authController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/admin/profile", protect, authorize("admin"), updateAdminProfile);
router.put("/admin/password", protect, authorize("admin"), updateAdminPassword);

export default router;
