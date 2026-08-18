import { GoogleGenAI } from "@google/genai";

const MAX_HISTORY_MESSAGES = 20;

function systemPrompt(user) {
  return `You are the JobMatch AI Assistant, embedded inside the JobMatch career platform. You help users with anything related to their JobMatch experience: using platform features (Resume Builder, Resume Analyzer, Job Matches, Saved Jobs, Applications, Profile), career advice, resume and interview tips, and general job search guidance.

Keep answers concise, practical, and friendly. Use short paragraphs or bullet points for multi-step instructions. If asked something entirely unrelated to careers, job searching, or JobMatch, politely redirect the conversation back to how you can help with their job search.

Context about the current user:
- Name: ${user.name || "Not provided"}
- Target role: ${user.professionalRole || "Not specified"}
- Skills: ${user.skills || "Not specified"}
- Location: ${user.location || "Not specified"}`;
}

export async function chatWithAssistant({ user, history }) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("The AI assistant is unavailable until GEMINI_API_KEY is configured.");
    error.status = 503;
    throw error;
  }

  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const contents = history.slice(-MAX_HISTORY_MESSAGES).map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.text }],
  }));

  const response = await client.models.generateContent({
    model: "gemini-3.6-flash",
    contents,
    config: {
      systemInstruction: systemPrompt(user),
    },
  });

  return response.text;
}
