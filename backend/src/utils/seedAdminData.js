import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";

export default async function seedAdminData() {
  await Promise.all([
    Company.init(),
    Job.init(),
    Resume.init(),
    Application.init(),
  ]);
}
