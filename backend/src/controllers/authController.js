import User from "../models/User.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";

export async function signup(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      res.status(400);
      throw new Error("Please fill all required fields");
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    });

    return sendTokenResponse(res, 201, user);
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password, role = "user" } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    if (!["user", "admin"].includes(role)) {
      res.status(400);
      throw new Error("Invalid account type");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (user.role !== role) {
      res.status(403);
      throw new Error(`This account is not registered as ${role}`);
    }

    return sendTokenResponse(res, 200, user);
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req, res) {
  return res.json({
    success: true,
    user: req.user,
  });
}

export async function updateAdminProfile(req, res, next) {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email) {
      res.status(400);
      throw new Error("Admin name and email cannot be empty");
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const admin = await User.findById(req.user._id);
    admin.name = name;
    admin.email = email;
    await admin.save();

    return sendTokenResponse(res, 200, admin);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminPassword(req, res, next) {
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

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    const admin = await User.findById(req.user._id).select("+password");

    if (!(await admin.matchPassword(oldPassword))) {
      res.status(401);
      throw new Error("Old password is incorrect");
    }

    admin.password = newPassword;
    await admin.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return next(error);
  }
}
