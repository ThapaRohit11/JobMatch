"use client";

import { useState } from "react";
import { resumes } from "../admin-data";

type Resume = (typeof resumes)[number];
type ResumeStatus = "Reviewed" | "Needs Revision" | "Pending";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function scoreColor(score: number) {
  return score >= 85 ? "text-emerald-600" : "text-blue-600";
}

function scoreBarColor(score: number) {
  return score >= 85 ? "bg-emerald-500" : "bg-blue-600";
}

function statusClasses(status: string) {
  if (status === "Reviewed") {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (status === "Pending") {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }

  return "border-orange-100 bg-orange-50 text-orange-700";
}

function statusDotClasses(status: string) {
  if (status === "Reviewed") {
    return "bg-emerald-500";
  }

  if (status === "Pending") {
    return "bg-blue-500";
  }

  return "bg-orange-500";
}

function ResumePreviewModal({
  resume,
  status,
  onClose,
}: {
  resume: Resume;
  status: ResumeStatus;
  onClose: () => void;
}) {
  const score = Number(resume.score);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
      <button
        aria-label="Close resume preview"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section className="relative z-10 flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-lg font-black text-white">
              {initials(resume.candidate)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-black text-slate-950">
                {resume.candidate}
              </h2>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-500">
                {resume.role} Resume
              </p>
            </div>
          </div>
          <button
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            onClick={onClose}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700 sm:grid-cols-2">
            <p>
              <span className="block text-xs uppercase text-slate-400">
                Email
              </span>
              {resume.email}
            </p>
            <p>
              <span className="block text-xs uppercase text-slate-400">
                Updated
              </span>
              {resume.updated}
            </p>
            <p>
              <span className="block text-xs uppercase text-slate-400">
                Uploaded
              </span>
              {resume.uploaded}
            </p>
            <p>
              <span className="block text-xs uppercase text-slate-400">
                Target Role
              </span>
              {resume.role}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-slate-400">
                <span className={`text-4xl font-black ${scoreColor(score)}`}>
                  {score}
                </span>{" "}
                <span className="text-base font-medium">/100</span>
              </p>
              <span
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-black ${statusClasses(status)}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${statusDotClasses(status)}`}
                />
                {status}
              </span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
              <div
                className={`h-full rounded-full ${scoreBarColor(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-100 bg-white p-5">
            <h3 className="text-lg font-black text-slate-950">
              Resume Preview
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
              <div>
                <p className="font-black text-slate-900">Professional Summary</p>
                <p>
                  {resume.candidate} is targeting {resume.role} roles with a
                  resume focused on measurable impact, relevant skills, and
                  clear career progression.
                </p>
              </div>
              <div>
                <p className="font-black text-slate-900">Key Skills</p>
                <p>
                  Leadership, communication, analytics, collaboration, ATS
                  keywords, role-specific project delivery.
                </p>
              </div>
              <div>
                <p className="font-black text-slate-900">Admin Notes</p>
                <p>
                  Resume was last updated on {resume.updated}. Review keyword
                  alignment and final formatting before candidate submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminResumesPage() {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [resumeStatuses, setResumeStatuses] = useState<
    Record<string, ResumeStatus>
  >(() =>
    Object.fromEntries(
      resumes.map((resume) => [
        resume.candidate,
        (resume.status === "Needs Work"
          ? "Needs Revision"
          : resume.status) as ResumeStatus,
      ]),
    ),
  );
  const [revisionNotes, setRevisionNotes] = useState<Record<string, string>>({});
  const statusValues = Object.values(resumeStatuses);
  const reviewed = statusValues.filter((status) => status === "Reviewed").length;
  const needsRevision = statusValues.filter(
    (status) => status === "Needs Revision",
  ).length;
  const pending = statusValues.filter((status) => status === "Pending").length;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            className="h-16 w-full rounded-3xl border border-cyan-100 bg-white px-14 text-lg font-medium text-slate-700 shadow-sm shadow-slate-900/10 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            placeholder="Search by candidate or target role..."
          />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-blue-600">Total Resumes</p>
          <p className="mt-2 text-3xl font-black text-blue-700">
            {resumes.length}
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-emerald-700">Reviewed</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {reviewed}
          </p>
        </div>
        <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-orange-700">Needs Revision</p>
          <p className="mt-2 text-3xl font-black text-orange-700">
            {needsRevision}
          </p>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-indigo-700">Pending</p>
          <p className="mt-2 text-3xl font-black text-indigo-700">
            {pending}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left">
            <thead className="bg-slate-50 text-sm font-bold text-slate-500">
              <tr>
                <th className="px-8 py-5">Candidate</th>
                <th className="px-8 py-5">Upload Date</th>
                <th className="px-8 py-5">Updated Date</th>
                <th className="px-8 py-5">Target Role</th>
                <th className="px-8 py-5">Score</th>
                <th className="w-48 px-8 py-5">Status</th>
                <th className="w-80 px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resumes.map((resume) => {
                const score = Number(resume.score);
                const currentStatus = resumeStatuses[resume.candidate];

                return (
                  <tr
                    key={resume.candidate}
                    className="transition hover:bg-cyan-50/35"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-sm font-black text-white">
                          {initials(resume.candidate)}
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-950">
                            {resume.candidate}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-400">
                            {resume.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-semibold text-slate-700">
                      {resume.uploaded}
                    </td>
                    <td className="px-8 py-6 font-semibold text-slate-700">
                      {resume.updated}
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex max-w-40 items-center whitespace-nowrap rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700">
                        {resume.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-28">
                        <p className="text-base font-medium text-slate-400">
                          <span className={`font-black ${scoreColor(score)}`}>
                            {score}
                          </span>{" "}
                          /100
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${scoreBarColor(score)}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex min-w-36 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-black ${statusClasses(currentStatus)}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${statusDotClasses(currentStatus)}`}
                        />
                        {currentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3">
                        <button
                          aria-label={`View ${resume.candidate} resume`}
                          className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-700"
                          onClick={() => setSelectedResume(resume)}
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <div className="grid w-56 gap-2">
                          <select
                            aria-label={`Update ${resume.candidate} resume status`}
                            className="h-10 rounded-xl border border-cyan-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                            value={currentStatus}
                            onChange={(event) =>
                              setResumeStatuses((current) => ({
                                ...current,
                                [resume.candidate]: event.target
                                  .value as ResumeStatus,
                              }))
                            }
                          >
                            <option value="Pending">Pending Review</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Needs Revision">Needs Revision</option>
                          </select>
                          {currentStatus === "Needs Revision" && (
                            <textarea
                              aria-label={`Revision notes for ${resume.candidate}`}
                              className="min-h-20 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                              placeholder="Add revision notes for the candidate..."
                              value={revisionNotes[resume.candidate] ?? ""}
                              onChange={(event) =>
                                setRevisionNotes((current) => ({
                                  ...current,
                                  [resume.candidate]: event.target.value,
                                }))
                              }
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedResume && (
        <ResumePreviewModal
          resume={selectedResume}
          status={resumeStatuses[selectedResume.candidate]}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  );
}
