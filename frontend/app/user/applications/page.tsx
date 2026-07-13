"use client";

import { useEffect, useState } from "react";
import {
  getUserApplications,
  UserApplication,
} from "../../../lib/user-api";

function statusClasses(status: string) {
  if (status === "Accepted") {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (status === "In Review") {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }

  if (status === "Pending") {
    return "border-amber-100 bg-amber-50 text-amber-700";
  }

  return "border-rose-100 bg-rose-50 text-rose-700";
}

function itemList(value?: string) {
  return value
    ?.split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

function JobDetailsModal({
  application,
  onClose,
}: {
  application: UserApplication;
  onClose: () => void;
}) {
  const job = application.jobDetails;
  const skills = itemList(job?.skills);
  const responsibilities = job?.responsibilities
    ?.split("\n")
    .filter(Boolean) ?? [];
  const requirements = job?.requirements?.split("\n").filter(Boolean) ?? [];
  const benefits = job?.benefits?.split("\n").filter(Boolean) ?? [];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close job details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-job-title"
        className="relative z-10 flex max-h-[84vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-sm font-black text-white">
              {job?.logo || application.logo}
            </div>
            <div className="min-w-0">
              <h2
                id="application-job-title"
                className="text-2xl font-black text-slate-950"
              >
                {application.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {application.company} - {application.location}
              </p>
            </div>
          </div>
          <button
            type="button"
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
          {job ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">Salary</p>
                  <p className="mt-1 text-sm font-black text-slate-800">{job.salary}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">Type</p>
                  <p className="mt-1 text-sm font-black text-slate-800">{job.type}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">Posted</p>
                  <p className="mt-1 text-sm font-black text-slate-800">{job.posted}</p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4">
                  <p className="text-xs font-black uppercase text-rose-300">Apply By</p>
                  <p className="mt-1 text-sm font-black text-rose-700">{job.applyBy || "Not set"}</p>
                </div>
              </div>

              {job.description && (
                <section className="rounded-2xl border border-cyan-100 bg-white p-5">
                  <h3 className="text-lg font-black text-slate-950">Job Description</h3>
                  <p className="mt-3 whitespace-pre-line text-sm font-medium leading-7 text-slate-600">
                    {job.description}
                  </p>
                </section>
              )}

              {skills.length > 0 && (
                <section className="rounded-2xl bg-violet-50/80 p-5">
                  <h3 className="text-lg font-black text-slate-950">Required Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-violet-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {(responsibilities.length > 0 || requirements.length > 0) && (
                <section className="grid gap-4 lg:grid-cols-2">
                  {responsibilities.length > 0 && (
                    <div className="rounded-2xl bg-cyan-50/70 p-5">
                      <h3 className="text-lg font-black text-slate-950">Responsibilities</h3>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-6 text-slate-700">
                        {responsibilities.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {requirements.length > 0 && (
                    <div className="rounded-2xl bg-indigo-50/70 p-5">
                      <h3 className="text-lg font-black text-slate-950">Requirements</h3>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-6 text-slate-700">
                        {requirements.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {benefits.length > 0 && (
                <section className="rounded-2xl bg-emerald-50/80 p-5">
                  <h3 className="text-lg font-black text-slate-950">Benefits</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {benefits.map((benefit) => (
                      <span key={benefit} className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-700">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-600">
              This job post is no longer available. Your application record is still preserved.
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end border-t border-slate-100 px-6 py-5">
          <button
            type="button"
            className="h-11 rounded-full bg-cyan-600 px-6 text-sm font-black text-white transition hover:bg-cyan-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export default function UserApplicationsPage() {
  const [userApplications, setUserApplications] = useState<UserApplication[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<UserApplication | null>(null);

  useEffect(() => {
    getUserApplications()
      .then((data) => {
        setUserApplications(data.applications);
        setLoadError("");
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load applications",
        );
      });

    const applicationToast = sessionStorage.getItem(
      "jobmatchApplicationToast",
    );
    if (applicationToast) {
      sessionStorage.removeItem("jobmatchApplicationToast");
      const showTimeout = window.setTimeout(
        () => setToastMessage(applicationToast),
        0,
      );
      const dismissTimeout = window.setTimeout(
        () => setToastMessage(""),
        4000,
      );
      return () => {
        window.clearTimeout(showTimeout);
        window.clearTimeout(dismissTimeout);
      };
    }
  }, []);

  const inReview = userApplications.filter(
    (application) => application.status === "In Review",
  ).length;
  const pending = userApplications.filter(
    (application) => application.status === "Pending",
  ).length;
  const accepted = userApplications.filter(
    (application) => application.status === "Accepted",
  ).length;
  const rejected = userApplications.filter(
    (application) => application.status === "Rejected",
  ).length;

  return (
    <div className="space-y-7">
      {toastMessage && (
        <div
          role="status"
          className="fixed right-5 top-24 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-sm font-bold text-emerald-700 shadow-2xl shadow-slate-900/20"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs">
            ✓
          </span>
          <span className="pt-0.5">{toastMessage}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            className="ml-2 text-slate-400 transition hover:text-slate-700"
            onClick={() => setToastMessage("")}
          >
            ×
          </button>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Applications
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
          Track every role you applied to and see the latest application status.
        </p>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {loadError}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-blue-600">Total Applied</p>
          <p className="mt-2 text-3xl font-black text-blue-700">
            {userApplications.length}
          </p>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-amber-700">Pending</p>
          <p className="mt-2 text-3xl font-black text-amber-700">{pending}</p>
        </div>
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-cyan-700">In Review</p>
          <p className="mt-2 text-3xl font-black text-cyan-700">{inReview}</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-emerald-700">Accepted</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {accepted}
          </p>
        </div>
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-rose-700">Rejected</p>
          <p className="mt-2 text-3xl font-black text-rose-700">{rejected}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead className="bg-slate-50 text-sm font-bold text-slate-500">
              <tr>
                <th className="px-8 py-5">Job</th>
                <th className="px-8 py-5">Company / Location</th>
                <th className="px-8 py-5">Applied Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userApplications.map((application) => (
                <tr
                  key={application.id}
                  className="transition hover:bg-cyan-50/35"
                >
                  <td className="px-8 py-6">
                    <p className="text-lg font-black text-slate-950">
                      {application.title}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-xs font-black text-white">
                        {application.logo}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {application.company}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-400">
                          {application.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-semibold text-slate-700">
                    {application.applied}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex min-w-28 justify-center rounded-full border px-3.5 py-2 text-xs font-black ${statusClasses(application.status)}`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      type="button"
                      aria-label={`View ${application.title} job details`}
                      title="View job details"
                      className="inline-grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-700"
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
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedApplication && (
        <JobDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
