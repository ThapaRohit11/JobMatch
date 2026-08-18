import { GoogleGenAI } from "@google/genai";
import { analyzeResume } from "./resumeAnalysis.js";

function fallbackInsights(resume) {
  const analysis = analyzeResume(resume);
  return {
    ...analysis,
    provider: "rules",
    note: "AI insights are unavailable until GEMINI_API_KEY is configured. Showing the built-in resume analysis instead.",
  };
}

const insightsSchema = {
  type: "object",
  properties: {
    score: { type: "integer" },
    label: { type: "string" },
    summary: { type: "string" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          message: { type: "string" },
        },
        required: ["title", "message"],
      },
    },
    strengths: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["score", "label", "summary", "recommendations", "strengths"],
};

export async function createAIResumeInsights(resume) {
  if (!process.env.GEMINI_API_KEY) return fallbackInsights(resume);

  const fallback = fallbackInsights(resume);
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const resumeContent = {
    role: resume.role,
    summary: resume.summary,
    skills: resume.skills,
    softSkills: resume.softSkills,
    experience: resume.experience,
    projects: resume.projects,
    education: resume.educationEntries || resume.education,
    certifications: resume.certifications,
  };

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are a precise career coach. Analyze this resume for the candidate's stated role. Give a score from 0 to 100, a short label, a one-sentence summary, 3 to 5 practical recommendations, and up to 4 strengths. Never invent qualifications or experience.\n\nResume:\n${JSON.stringify(resumeContent)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: insightsSchema,
      },
    });

    const insights = JSON.parse(response.text);

    if (!Number.isFinite(insights.score) || !Array.isArray(insights.recommendations)) {
      return fallback;
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(insights.score))),
      label: typeof insights.label === "string" ? insights.label : fallback.label,
      summary: typeof insights.summary === "string" ? insights.summary : fallback.summary,
      recommendations: insights.recommendations
        .filter((item) => typeof item?.title === "string" && typeof item?.message === "string")
        .slice(0, 5),
      strengths: Array.isArray(insights.strengths) ? insights.strengths.filter((item) => typeof item === "string").slice(0, 4) : [],
      provider: "gemini",
    };
  } catch (error) {
    console.error("Gemini resume insights failed:", error instanceof Error ? error.message : error);
    return fallback;
  }
}
