"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getUserDashboard,
  UserApplication,
  UserJob,
  UserProfile,
} from "../../lib/user-api";

function statusClasses(status: string) {
  if (status === "Accepted") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "In Review") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "Pending") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-rose-50 text-rose-700";
}

function resumeScoreStyles(score: number) {
  if (score >= 80) return { text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" };
  if (score >= 70) return { text: "text-blue-600", badge: "bg-blue-50 text-blue-700", bar: "bg-blue-500" };
  if (score >= 60) return { text: "text-amber-600", badge: "bg-amber-50 text-amber-700", bar: "bg-amber-500" };
  return { text: "text-rose-600", badge: "bg-rose-50 text-rose-700", bar: "bg-rose-500" };
}

export default function UserDashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    role: "",
    location: "",
    joined: "",
    resumeScore: 0,
    resumeLabel: "No resume",
    skills: "",
  });
  const [jobMatches, setJobMatches] = useState<UserJob[]>([]);
  const [userApplications, setUserApplications] = useState<UserApplication[]>([]);
  const [resumeTips, setResumeTips] = useState<string[]>([]);

  useEffect(() => {
    getUserDashboard().then((data) => {
      setUserProfile(data.profile);
      setJobMatches(data.jobMatches);
      setUserApplications(data.applications);
      setResumeTips(
        (data.resumeTips ?? []).filter((tip: string) => tip.trim()),
      );
    });
  }, []);

  const accepted = userApplications.filter(
    (application) => application.status === "Accepted",
  ).length;
  const scoreStyles = resumeScoreStyles(userProfile.resumeScore);

  return (
    <div className="space-y-7">
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-cyan-100/80 bg-white p-6 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-black uppercase text-cyan-700">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {userProfile.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Review your resume score, track active applications, and explore
            job matches selected for your current target role.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/user/applications"
              className="inline-flex h-12 items-center justify-center rounded-full bg-cyan-600 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
            >
              View Applications
            </Link>
            <Link
              href="/user/profile"
              className="inline-flex h-12 items-center justify-center rounded-full border border-cyan-100 bg-white px-6 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50"
            >
              Update Profile
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-100/80 bg-white p-6 shadow-sm shadow-slate-900/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-slate-400">
                Resume Score
              </p>
              <p className="mt-2 text-slate-400">
                <span className={`text-5xl font-black ${scoreStyles.text}`}>
                  {userProfile.resumeScore}
                </span>{" "}
                /100
              </p>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-black ${scoreStyles.badge}`}>
              {userProfile.resumeLabel}
            </span>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${scoreStyles.bar}`}
              style={{ width: `${userProfile.resumeScore}%` }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-blue-600">Job Matches</p>
          <p className="mt-2 text-3xl font-black text-blue-700">
            {jobMatches.length}
          </p>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-indigo-700">Applications</p>
          <p className="mt-2 text-3xl font-black text-indigo-700">
            {userApplications.length}
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-emerald-700">Accepted</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {accepted}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-xl font-black text-slate-950">
              Recommended Jobs
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {jobMatches.map((job) => (
              <div key={job.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-xs font-black text-white">
                    {job.logo}
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-950">
                      {job.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {job.company} · {job.location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700">
                    {job.match}% match
                  </span>
                </div>
              </div>
            ))}
            {jobMatches.length === 0 && (
              <div className="p-6 text-center">
                <p className="font-black text-slate-800">
                  No jobs match your title and skills yet
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Keep your target job title and skills updated in your
                  profile to receive recommendations.
                </p>
                <Link
                  href="/user/profile"
                  className="mt-4 inline-flex h-10 items-center rounded-full bg-cyan-600 px-5 text-sm font-bold text-white transition hover:bg-cyan-700"
                >
                  Update Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-100/80 bg-white p-6 shadow-sm shadow-slate-900/10">
          <h2 className="text-xl font-black text-slate-950">Resume Tips</h2>
          <div className="mt-5 space-y-3">
            {resumeTips.map((tip) => (
              <div key={tip} className="rounded-2xl bg-cyan-50/70 p-4 text-sm font-semibold leading-6 text-slate-700">
                {tip}
              </div>
            ))}
            {resumeTips.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-500">
                Save your resume to receive an automatic, content-based analysis.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">
            Recent Applications
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {userApplications.slice(0, 3).map((application) => (
            <div key={application.id} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black text-slate-950">
                  {application.title}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {application.company} · Applied {application.applied}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${statusClasses(application.status)}`}
              >
                {application.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
