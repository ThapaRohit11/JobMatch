import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salary: { type: String, required: true, trim: true },
    skills: { type: String, default: "" },
    type: { type: String, required: true, trim: true },
    applyBy: { type: String, default: "" },
    description: { type: String, default: "" },
    responsibilities: { type: String, default: "" },
    requirements: { type: String, default: "" },
    benefits: { type: String, default: "" },
    applicants: { type: Number, default: 0 },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
