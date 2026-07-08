"use client";

import { useState } from "react";
import { applications, resumes } from "../admin-data";

type Application = (typeof applications)[number];
type ApplicationStatus = "In Review" | "Accepted" | "Rejected";
type Resume = (typeof resumes)[number];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusClasses(status: string) {
  if (status === "Accepted") {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (status === "In Review") {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }

  return "border-rose-100 bg-rose-50 text-rose-700";
}

function statusDotClasses(status: string) {
  if (status === "Accepted") {
    return "bg-emerald-500";
  }

  if (status === "In Review") {
    return "bg-blue-500";
  }

  return "bg-rose-500";
}

function scoreColor(score: number) {
  return score >= 85 ? "text-emerald-600" : "text-blue-600";
}

function scoreBarColor(score: number) {
  return score >= 85 ? "bg-emerald-500" : "bg-blue-600";
}

function ResumeModal({
  application,
  resume,
  status,
  onClose,
}: {
  application: Application;
  resume: Resume | undefined;
  status: ApplicationStatus;
  onClose: () => void;
}) {
  const score = Number(resume?.score ?? 0);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
      <button
        aria-label="Close resume details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section className="relative z-10 flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-lg font-black text-white">
              {initials(application.applicant)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-black text-slate-950">
                {application.applicant}
              </h2>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-500">
                Resume for {application.job}
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
              {application.email}
            </p>
            <p>
              <span className="block text-xs uppercase text-slate-400">
                Applied Date
              </span>
              {application.date}
            </p>
            <p>
              <span className="block text-xs uppercase text-slate-400">
                Company
              </span>
              {application.company}
            </p>
            <p>
              <span className="block text-xs uppercase text-slate-400">
                Status
              </span>
              <span
                className={`mt-1 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${statusClasses(status)}`}
              >
                <span className={`h-2 w-2 rounded-full ${statusDotClasses(status)}`} />
                {status}
              </span>
            </p>
          </div>

          {resume ? (
            <>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-slate-400">
                    <span className={`text-4xl font-black ${scoreColor(score)}`}>
                      {score}
                    </span>{" "}
                    <span className="text-base font-medium">/100</span>
                  </p>
                  <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700">
                    {resume.role}
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
                  <p>
                    {resume.candidate} is targeting {resume.role} roles with a
                    resume focused on relevant skills, measurable impact, and
                    ATS-ready formatting.
                  </p>
                  <p>
                    Last updated on {resume.updated}. Uploaded on{" "}
                    {resume.uploaded}.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm font-semibold text-amber-800">
              No resume is linked to this applicant yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function AdminApplicationsPage() {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [applicationStatuses, setApplicationStatuses] = useState<
    Record<string, ApplicationStatus>
  >(() =>
    Object.fromEntries(
      applications.map((application) => [
        `${application.applicant}-${application.job}`,
        (["Accepted", "Rejected"].includes(application.status)
          ? application.status
        : "In Review") as ApplicationStatus,
      ]),
    ),
  );
  const statusValues = Object.values(applicationStatuses);
  const inReview = statusValues.filter((status) => status === "In Review").length;
  const accepted = statusValues.filter((status) => status === "Accepted").length;
  const rejected = statusValues.filter((status) => status === "Rejected").length;

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
            placeholder="Search by applicant, job, or company..."
          />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-blue-600">Total Applications</p>
          <p className="mt-2 text-3xl font-black text-blue-700">
            {applications.length}
          </p>
        </div>
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-cyan-700">In Review</p>
          <p className="mt-2 text-3xl font-black text-cyan-700">
            {inReview}
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-emerald-700">Accepted</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {accepted}
          </p>
        </div>
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-rose-700">Rejected</p>
          <p className="mt-2 text-3xl font-black text-rose-700">
            {rejected}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1160px] text-left">
            <thead className="bg-slate-50 text-sm font-bold text-slate-500">
              <tr>
                <th className="px-8 py-5">Applicant</th>
                <th className="px-8 py-5">Job / Company</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5">Applied Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((application) => {
                const applicationKey = `${application.applicant}-${application.job}`;
                const currentStatus =
                  applicationStatuses[applicationKey] ?? "In Review";

                return (
                  <tr
                    key={applicationKey}
                    className="transition hover:bg-cyan-50/35"
                  >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-sm font-black text-white">
                        {initials(application.applicant)}
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-950">
                          {application.applicant}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-400">
                          {application.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900">
                      {application.job}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-400">
                      {application.company}
                    </p>
                  </td>
                  <td className="px-8 py-6 font-semibold text-slate-700">
                    {application.location}
                  </td>
                  <td className="px-8 py-6 font-semibold text-slate-700">
                    {application.date}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex min-w-32 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-black ${statusClasses(currentStatus)}`}
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
                        aria-label={`View ${application.applicant} application`}
                        className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-700"
                        onClick={() => setSelectedApplication(application)}
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
                      <select
                        aria-label={`Update ${application.applicant} application status`}
                        className="h-10 w-32 rounded-xl border border-cyan-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                        value={currentStatus}
                        onChange={(event) =>
                          setApplicationStatuses((current) => ({
                            ...current,
                            [applicationKey]: event.target
                              .value as ApplicationStatus,
                          }))
                        }
                      >
                        <option value="In Review">In Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedApplication && (
        <ResumeModal
          application={selectedApplication}
          resume={resumes.find(
            (resume) => resume.email === selectedApplication.email,
          )}
          status={
            applicationStatuses[
              `${selectedApplication.applicant}-${selectedApplication.job}`
            ] ?? "In Review"
          }
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
