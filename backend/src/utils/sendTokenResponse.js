import generateToken from "./generateToken.js";

export default function sendTokenResponse(res, statusCode, user) {
  return res.status(statusCode).json({
    success: true,
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
