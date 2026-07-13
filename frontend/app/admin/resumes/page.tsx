"use client";

import { useEffect, useState } from "react";
import {
  AdminResume,
  getAdminResumes,
  updateAdminResume,
} from "../../../lib/admin-api";

type Resume = AdminResume;
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
  const experiences = resume.experience ?? [];
  const projects = resume.projects ?? [];
  const educationEntries = resume.educationEntries ?? [];
  const certifications = resume.certifications ?? [];
  const awards = resume.awards ?? [];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
      <button
        aria-label="Close resume preview"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
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

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <header className="border-b border-slate-200 pb-5 text-center">
              <h3 className="text-2xl font-black uppercase tracking-wide text-slate-950">
                {resume.candidate}
              </h3>
              <p className="mt-1 font-bold text-cyan-700">{resume.role}</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {[
                  resume.contactEmail || resume.email,
                  resume.phone,
                  resume.location,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </p>
              {(resume.portfolio || resume.github) && (
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {[resume.portfolio, resume.github].filter(Boolean).join(" | ")}
                </p>
              )}
            </header>

            <div className="mt-5 space-y-5 text-sm leading-6 text-slate-700">
              {resume.summary && (
                <section>
                  <h4 className="border-b border-slate-200 pb-1 font-black uppercase tracking-wide text-slate-950">
                    Professional Summary
                  </h4>
                  <p className="mt-2 whitespace-pre-line">{resume.summary}</p>
                </section>
              )}

              {(resume.skills || resume.softSkills) && (
                <section>
                  <h4 className="border-b border-slate-200 pb-1 font-black uppercase tracking-wide text-slate-950">
                    Skills
                  </h4>
                  {resume.skills && (
                    <p className="mt-2">
                      <span className="font-bold text-slate-900">Technical skills:</span>{" "}
                      {resume.skills}
                    </p>
                  )}
                  {resume.softSkills && (
                    <p className="mt-1">
                      <span className="font-bold text-slate-900">Soft skills:</span>{" "}
                      {resume.softSkills}
                    </p>
                  )}
                </section>
              )}

              {experiences.length > 0 && (
                <section>
                  <h4 className="border-b border-slate-200 pb-1 font-black uppercase tracking-wide text-slate-950">
                    Experience
                  </h4>
                  <div className="mt-3 space-y-4">
                    {experiences.map((item, index) => (
                      <div key={`${item.role}-${item.company}-${index}`}>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div>
                            {item.role && <p className="font-black text-slate-950">{item.role}</p>}
                            {item.company && <p className="font-bold text-slate-600">{item.company}</p>}
                          </div>
                          {(item.period || item.location) && (
                            <p className="shrink-0 font-bold text-slate-500">
                              {[item.period, item.location].filter(Boolean).join(" | ")}
                            </p>
                          )}
                        </div>
                        {item.detail && (
                          <p className="mt-2 whitespace-pre-line">{item.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h4 className="border-b border-slate-200 pb-1 font-black uppercase tracking-wide text-slate-950">
                    Projects
                  </h4>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {projects.map((project, index) => (
                      <li key={`${project}-${index}`} className="whitespace-pre-line">
                        {project}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {educationEntries.length > 0 && (
                <section>
                  <h4 className="border-b border-slate-200 pb-1 font-black uppercase tracking-wide text-slate-950">
                    Education
                  </h4>
                  <div className="mt-3 space-y-4">
                    {educationEntries.map((item, index) => (
                      <div
                        key={`${item.school}-${item.degree}-${index}`}
                        className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                      >
                        <div>
                          {item.school && <p className="font-black text-slate-950">{item.school}</p>}
                          {item.degree && <p className="font-semibold text-slate-600">{item.degree}</p>}
                        </div>
                        <div className="shrink-0 sm:text-right">
                          {(item.started || item.graduation) && (
                            <p className="font-bold text-slate-500">
                              {[item.started, item.graduation].filter(Boolean).join(" - ")}
                            </p>
                          )}
                          {item.gpa && <p className="text-xs font-semibold text-slate-500">{item.gpa}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {certifications.length > 0 && (
                <section>
                  <h4 className="border-b border-slate-200 pb-1 font-black uppercase tracking-wide text-slate-950">
                    Certifications
                  </h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {certifications.map((certification, index) => (
                      <li key={`${certification}-${index}`}>{certification}</li>
                    ))}
                  </ul>
                </section>
              )}

              {awards.length > 0 && (
                <section>
                  <h4 className="border-b border-slate-200 pb-1 font-black uppercase tracking-wide text-slate-950">
                    Awards / Achievements
                  </h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {awards.map((award, index) => (
                      <li key={`${award}-${index}`}>{award}</li>
                    ))}
                  </ul>
                </section>
              )}

              {!resume.summary &&
                !resume.skills &&
                !resume.softSkills &&
                experiences.length === 0 &&
                projects.length === 0 &&
                educationEntries.length === 0 &&
                certifications.length === 0 &&
                awards.length === 0 && (
                  <p className="rounded-2xl bg-slate-50 p-4 font-semibold text-slate-500">
                    This resume does not contain any additional details yet.
                  </p>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [resumeStatuses, setResumeStatuses] = useState<
    Record<string, ResumeStatus>
  >({});
  const [revisionNotes, setRevisionNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    getAdminResumes().then((data) => {
      setResumes(data.resumes);
      setResumeStatuses(
        Object.fromEntries(
          data.resumes.map((resume: Resume) => [resume.id, resume.status]),
        ),
      );
      setRevisionNotes(
        Object.fromEntries(
          data.resumes.map((resume: Resume) => [resume.id, resume.revisionNotes || ""]),
        ),
      );
    });
  }, []);
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
                const currentStatus = resumeStatuses[resume.id] ?? "Pending";

                return (
                  <tr
                    key={resume.id}
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
                            onChange={async (event) => {
                              const status = event.target.value as ResumeStatus;
                              setResumeStatuses((current) => ({
                                ...current,
                                [resume.id]: status,
                              }));
                              const data = await updateAdminResume(resume.id, {
                                status,
                                revisionNotes: revisionNotes[resume.id] || "",
                              });
                              setResumes((current) =>
                                current.map((item) =>
                                  item.id === data.resume.id ? data.resume : item,
                                ),
                              );
                            }}
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
                              onChange={async (event) => {
                                const notes = event.target.value;
                                setRevisionNotes((current) => ({
                                  ...current,
                                  [resume.id]: notes,
                                }));
                                await updateAdminResume(resume.id, {
                                  status: currentStatus,
                                  revisionNotes: notes,
                                });
                              }}
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
          status={resumeStatuses[selectedResume.id] ?? "Pending"}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  );
}
