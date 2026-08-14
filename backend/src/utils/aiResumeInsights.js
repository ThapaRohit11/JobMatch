import OpenAI from "openai";
import { analyzeResume } from "./resumeAnalysis.js";

function fallbackInsights(resume) {
  const analysis = analyzeResume(resume);
  return {
    ...analysis,
    provider: "rules",
    note: "AI insights are unavailable until OPENAI_API_KEY is configured. Showing the built-in resume analysis instead.",
  };
}

function parseJson(text) {
  const json = text.replace(/^```json\s*|\s*```$/g, "").trim();
  return JSON.parse(json);
}

export async function createAIResumeInsights(resume) {
  if (!process.env.OPENAI_API_KEY) return fallbackInsights(resume);

  const fallback = fallbackInsights(resume);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      input: `You are a precise career coach. Analyze this resume for the candidate's stated role. Return only valid JSON with this exact shape: {"score": number from 0 to 100, "label": string, "summary": string, "recommendations": [{"title": string, "message": string}], "strengths": [string]}. Give 3 to 5 practical recommendations. Never invent qualifications or experience.\n\nResume:\n${JSON.stringify(resumeContent)}`,
    });
    const insights = parseJson(response.output_text);

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
      provider: "openai",
    };
  } catch (error) {
    console.error("OpenAI resume insights failed:", error instanceof Error ? error.message : error);
    return fallback;
  }
}
