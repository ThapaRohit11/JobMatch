import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    candidate: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    contactEmail: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    portfolio: { type: String, default: "", trim: true },
    github: { type: String, default: "", trim: true },
    score: { type: Number, default: 0 },
    analysis: { type: mongoose.Schema.Types.Mixed, default: null },
    role: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Reviewed", "Needs Revision", "Pending"],
      default: "Pending",
    },
    revisionNotes: { type: String, default: "" },
    summary: { type: String, default: "" },
    skills: { type: String, default: "" },
    softSkills: { type: String, default: "" },
    projects: { type: [String], default: [] },
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    educationEntries: { type: [mongoose.Schema.Types.Mixed], default: [] },
    certifications: { type: [String], default: [] },
    awards: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
