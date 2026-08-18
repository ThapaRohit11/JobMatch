"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAIResumeInsights, getUserResume } from "../../../../lib/user-api";

type Recommendation = { title: string; message: string };
type Analysis = {
  score: number;
  label: string;
  summary: string;
  recommendations: Recommendation[];
  strengths?: string[];
  breakdown?: Record<string, number>;
  provider?: "gemini" | "rules";
  note?: string;
};
type AnalysisHistoryItem = {
  id: string;
  title: string;
  reviewedDate: string;
  score: number;
  label: string;
  status: string;
  recommendations: Recommendation[];
};

const categoryNames: Record<string, string> = {
  contact: "Profile details",
  summary: "Summary",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  credentials: "Credentials",
  atsReadiness: "ATS readiness",
};

const categoryMaximums: Record<string, number> = {
  contact: 12,
  summary: 15,
  skills: 15,
  experience: 25,
  education: 12,
  projects: 10,
  credentials: 5,
  atsReadiness: 6,
};

function scoreColor(score: number) {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#60a5fa";
  return "#fb7185";
}

function recommendationSteps(recommendation: Recommendation) {
  const value = `${recommendation.title} ${recommendation.message}`.toLowerCase();
  if (value.includes("contact")) return ["Add a current phone number and location.", "Confirm that your target job title is specific.", "Add a working LinkedIn, portfolio, or GitHub link."];
  if (value.includes("summary")) return ["Write a focused summary of 40–120 words.", "Mention the target role and your strongest relevant skills.", "Include one achievement supported by a number, percentage, or measurable result."];
  if (value.includes("skill")) return ["List at least 6–8 role-specific technical skills.", "Add at least two relevant soft skills.", "Use the same accurate skill terms commonly found in your target job descriptions."];
  if (value.includes("impact") || value.includes("experience bullet")) return ["Start each bullet with a strong action verb such as developed, led, improved, or automated.", "Explain what you delivered or changed—not only your responsibility.", "Add evidence such as percentages, time saved, users served, revenue, or project counts."];
  if (value.includes("experience")) return ["Add relevant employment, internship, freelance, volunteer, or practical experience.", "Include job title, organization, dates, and location for each entry.", "Write 2–4 achievement-focused bullets for each important role."];
  if (value.includes("education")) return ["Add your qualification or course name.", "Include the institution and study dates or graduation date.", "Add GPA, honors, or relevant coursework only when it strengthens the application."];
  if (value.includes("project")) return ["Add the project goal and the problem it solved.", "Name the technologies and tools you personally used.", "Describe your contribution and finish with a measurable result or outcome."];
  if (value.includes("ats") || value.includes("keyword")) return ["Choose keywords from the target job description that accurately match your experience.", "Use standard section titles such as Experience, Education, Skills, and Projects.", "Write keywords naturally in your summary, skills, and achievement bullets; do not keyword-stuff."];
  if (value.includes("tailor")) return ["Align the summary with the exact role you are applying for.", "Move the most relevant skills and achievements higher.", "Keep every claim accurate and supported by your real experience."];
  return [recommendation.message, "Update the related section in Resume Builder.", "Save the resume and run the analyzer again to measure the change."];
}

export default function ResumeAnalyzerPage() {
  const [analysis, setAnalysis] = useState<Analysis | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState("");

  useEffect(() => {
    getUserResume()
      .then((data) => {
        setAnalysis(data.resume.analysis);
        setHistory(data.analysisHistory || []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to analyze your resume."));
  }, []);

  async function generateAIInsights() {
    setIsGenerating(true);
    setAiStatus("");
    try {
      const data = await getAIResumeInsights();
      setAnalysis(data.insights);
      setAiStatus(data.insights.provider === "gemini" ? "Fresh AI insights generated from your saved resume." : data.insights.note || "Showing built-in resume insights.");
    } catch (reason) {
      setAiStatus(reason instanceof Error ? reason.message : "Unable to generate AI insights.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (error) return <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-semibold text-rose-700">{error}</p>;
  if (analysis === undefined) return <div className="grid min-h-72 place-items-center rounded-3xl border border-slate-200 bg-white"><p className="text-sm font-semibold text-slate-500">Analyzing your saved resume...</p></div>;
  if (!analysis) return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">✦</div>
      <h1 className="mt-5 text-2xl font-black text-slate-950">Create your resume first</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">Save your information in Resume Builder, then return here for a score and practical recommendations.</p>
      <Link href="/user/resume" className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700">Open Resume Builder</Link>
    </section>
  );

  const color = scoreColor(analysis.score);
  const breakdown = Object.entries(analysis.breakdown || {});

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl shadow-slate-900/15 sm:p-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full p-2" style={{ background: `conic-gradient(${color} ${analysis.score * 3.6}deg, #273449 0deg)` }}>
                <div className="grid h-full w-full place-items-center rounded-full bg-slate-950 text-center">
                  <p><span className="text-4xl font-black">{analysis.score}</span><span className="text-sm font-bold text-slate-400">/100</span></p>
                </div>
              </div>
              <div className="max-w-xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-300">Resume Analyzer</p>
                <h1 className="mt-3 text-3xl font-black">{analysis.label}</h1>
                <p className="mt-3 leading-7 text-slate-300">{analysis.summary}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-300">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {analysis.provider === "gemini" ? "AI-powered review" : "Analysis of your latest saved resume"}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <button type="button" onClick={generateAIInsights} disabled={isGenerating} className="h-12 rounded-full bg-indigo-500 px-6 text-sm font-black text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">{isGenerating ? "Generating insights..." : "Generate AI insights"}</button>
              <Link href="/user/resume" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-slate-950 transition hover:bg-slate-100">Improve in Builder</Link>
            </div>
          </div>
          {aiStatus && <p role="status" className="mt-6 rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-4 py-3 text-sm font-semibold text-indigo-100">{aiStatus}</p>}
        </div>
      </section>

      {breakdown.length > 0 && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">Score breakdown</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">What your score is based on</h2>
          </div>
          <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {breakdown.map(([key, value]) => {
              const maximum = categoryMaximums[key] || 10;
              const percent = Math.min(100, Math.round((value / maximum) * 100));
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm"><span className="font-bold text-slate-700">{categoryNames[key] || key}</span><span className="font-black text-slate-950">{value}/{maximum}</span></div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500" style={{ width: `${percent}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className={`grid gap-6 ${analysis.strengths?.length ? "lg:grid-cols-[0.85fr_1.15fr]" : ""}`}>
        {!!analysis.strengths?.length && (
          <section className="rounded-[2rem] border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Working well</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Resume strengths</h2>
            <div className="mt-5 space-y-3">{analysis.strengths.map((strength, index) => <div key={`${strength}-${index}`} className="flex gap-3 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-slate-700 shadow-sm"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">✓</span><p>{strength}</p></div>)}</div>
          </section>
        )}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Action plan</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Recommended improvements</h2>
          <p className="mt-2 text-sm text-slate-500">Work through these priorities, then save your resume and analyze it again.</p>
          <div className="mt-6 space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <article key={`${recommendation.title}-${index}`} className="flex gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-600 text-xs font-black text-white">{String(index + 1).padStart(2, "0")}</span>
                <div><h3 className="font-black text-indigo-950">{recommendation.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.message}</p></div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {history.length > 0 && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">Progress over time</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Analysis history</h2>
              <p className="mt-2 text-sm text-slate-500">A new review is recorded whenever you save your resume.</p>
            </div>
            <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">{history.length} {history.length === 1 ? "review" : "reviews"}</span>
          </div>

          <div className="mt-6 space-y-3">
            {history.map((review, index) => {
              const expanded = expandedHistoryId === review.id;
              const previousScore = history[index + 1]?.score;
              const difference = previousScore === undefined ? null : review.score - previousScore;
              return (
                <article key={review.id} className="overflow-hidden rounded-2xl border border-slate-200">
                  <button type="button" aria-expanded={expanded} onClick={() => setExpandedHistoryId(expanded ? "" : review.id)} className="flex w-full flex-col gap-4 p-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">{review.score}</div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2"><h3 className="font-black text-slate-900">{index === 0 ? "Latest review" : review.title}</h3>{index === 0 && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700">Current</span>}</div>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{review.reviewedDate} · {review.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-16 sm:pl-0">
                      <span className={`rounded-full px-3 py-1.5 text-xs font-black ${difference === null ? "bg-slate-50 text-slate-500" : difference > 0 ? "bg-emerald-50 text-emerald-700" : difference < 0 ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
                        {difference === null ? "First review" : difference === 0 ? "No change" : `${difference > 0 ? "+" : ""}${difference} vs previous`}
                      </span>
                      <svg aria-hidden="true" className={`h-5 w-5 text-slate-400 transition ${expanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </button>
                  {expanded && (
                    <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Recommendations from this review</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {review.recommendations.map((recommendation, recommendationIndex) => (
                          <div key={`${recommendation.title}-${recommendationIndex}`} className="rounded-xl bg-white p-5 shadow-sm">
                            <div className="flex items-start gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-100 text-xs font-black text-violet-700">{recommendationIndex + 1}</span><div><h4 className="text-sm font-black text-slate-800">{recommendation.title}</h4><p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.message}</p></div></div>
                            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">What to change or add</p>
                            <ul className="mt-2 space-y-2">
                              {recommendationSteps(recommendation).map((step, stepIndex) => <li key={`${step}-${stepIndex}`} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" /><span>{step}</span></li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
