import User from "../models/User.js";

export default async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@jobmatch.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    console.log(`Admin account ready: ${existingAdmin.email}`);
    return;
  }

  const admin = await User.findOne({ email }).select("+password");

  if (admin) {
    admin.name = "JobMatch Admin";
    admin.password = password;
    admin.role = "admin";
    await admin.save();
    console.log(`Admin account ready: ${email}`);
    return;
  }

  await User.create({
    name: "JobMatch Admin",
    email,
    password,
    role: "admin",
  });

  console.log(`Admin account created: ${email}`);
}
