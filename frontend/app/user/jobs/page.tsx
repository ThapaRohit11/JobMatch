"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { applyToUserJob, getUserJobs, UserJob } from "../../../lib/user-api";

type Job = UserJob;

function statusClasses(status: string) {
  return status === "Open"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-600";
}

function typeClasses(type: string) {
  return type === "Hybrid"
    ? "bg-indigo-50 text-indigo-700"
    : "bg-cyan-50 text-cyan-700";
}

function lines(value?: string) {
  return value?.split("\n").filter(Boolean) ?? [];
}

function skillList(value?: string) {
  return value
    ?.split(/[,;\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean) ?? [];
}

function JobDetailsModal({
  job,
  onClose,
  onApplied,
}: {
  job: Job;
  onClose: () => void;
  onApplied: () => void;
}) {
  const [error, setError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const responsibilities = lines(job.responsibilities);
  const requirements = lines(job.requirements);
  const benefits = lines(job.benefits);
  const skills = skillList(job.skills);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
      <button
        aria-label="Close job details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section className="relative z-10 flex max-h-[84vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-sm font-black text-white">
              {job.logo}
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-slate-950">
                {job.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {job.company} - {job.location}
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">
                Salary
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">
                {job.salary}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">
                Type
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">
                {job.type}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">
                Posted
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">
                {job.posted}
              </p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-4">
              <p className="text-xs font-black uppercase text-rose-300">
                Apply By
              </p>
              <p className="mt-1 text-sm font-black text-rose-700">
                {job.applyBy || "Not set"}
              </p>
            </div>
          </div>

          <section className="rounded-2xl border border-cyan-100 bg-white p-5">
            <h3 className="text-lg font-black text-slate-950">
              Job Description
            </h3>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              {job.description || "No description has been added yet."}
            </p>
          </section>

          <section className="rounded-2xl bg-violet-50/80 p-5">
            <h3 className="text-lg font-black text-slate-950">
              Required Skills
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-violet-700"
                >
                  {skill}
                </span>
              ))}
              {skills.length === 0 && (
                <span className="text-sm font-semibold text-slate-500">
                  No skills added yet.
                </span>
              )}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-cyan-50/70 p-5">
              <h3 className="text-lg font-black text-slate-950">
                Responsibilities
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-6 text-slate-700">
                {responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                {responsibilities.length === 0 && <li>No responsibilities added yet.</li>}
              </ul>
            </div>
            <div className="rounded-2xl bg-indigo-50/70 p-5">
              <h3 className="text-lg font-black text-slate-950">
                Requirements
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-6 text-slate-700">
                {requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                {requirements.length === 0 && <li>No requirements added yet.</li>}
              </ul>
            </div>
          </section>

          <section className="rounded-2xl bg-emerald-50/80 p-5">
            <h3 className="text-lg font-black text-slate-950">Benefits</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-700"
                >
                  {benefit}
                </span>
              ))}
              {benefits.length === 0 && (
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-700">
                  No benefits added yet
                </span>
              )}
            </div>
          </section>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 sm:mr-auto">
              {error}
            </p>
          )}
          <button
            className="h-11 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="h-11 rounded-full bg-cyan-600 px-6 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isApplying}
            onClick={async () => {
              try {
                setIsApplying(true);
                setError("");
                await applyToUserJob(job.id);
                onApplied();
              } catch (applyError) {
                setError(applyError instanceof Error ? applyError.message : "Unable to apply");
                setIsApplying(false);
              }
            }}
          >
            {isApplying ? "Applying..." : "Apply Now"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function UserJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const openJobs = jobs.filter((job) => job.status === "Open").length;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredJobs = normalizedQuery
    ? jobs.filter((job) =>
        [job.title, job.company, job.location, job.type, job.skills]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery)),
      )
    : jobs;

  useEffect(() => {
    getUserJobs().then((data) => setJobs(data.jobs));
  }, []);

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
            type="search"
            aria-label="Search jobs"
            className="h-16 w-full rounded-3xl border border-cyan-100 bg-white px-14 text-lg font-medium text-slate-700 shadow-sm shadow-slate-900/10 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-blue-600">Total Jobs</p>
          <p className="mt-2 text-3xl font-black text-blue-700">
            {jobs.length}
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-emerald-700">Open Jobs</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {openJobs}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-slate-500">Closed Jobs</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {jobs.length - openJobs}
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredJobs.map((job) => (
          <article
            key={job.id}
            className="rounded-3xl border border-cyan-100/80 bg-white p-6 shadow-sm shadow-slate-900/10 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-900/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-cyan-500/20">
                  {job.logo}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-slate-950">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {job.company} - {job.location}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black ${statusClasses(job.status)}`}
              >
                {job.status}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Salary
                </p>
                <p className="mt-1 text-sm font-black text-slate-800">
                  {job.salary}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Type
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black ${typeClasses(job.type)}`}
                >
                  {job.type}
                </span>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4">
                <p className="text-xs font-black uppercase text-rose-300">
                  Apply By
                </p>
                <p className="mt-1 text-sm font-black text-rose-700">
                  {job.applyBy || "Not set"}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-black uppercase text-slate-400">
                Required Skills
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {skillList(job.skills).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700"
                  >
                    {skill}
                  </span>
                ))}
                {skillList(job.skills).length === 0 && (
                  <span className="text-sm font-semibold text-slate-400">
                    No skills added
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Posted {job.posted}
              </p>
              <button
                className={`h-11 rounded-full px-6 text-sm font-black transition ${
                  job.status === "Open"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-700"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
                disabled={job.status !== "Open"}
                onClick={() => setSelectedJob(job)}
              >
                {job.status === "Open" ? "Apply Now" : "Closed"}
              </button>
            </div>
          </article>
        ))}
        {filteredJobs.length === 0 && (
          <div className="rounded-3xl border border-dashed border-cyan-200 bg-white p-10 text-center xl:col-span-2">
            <p className="text-lg font-black text-slate-800">
              No jobs found
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Try another job title, company, location, type, or skill.
            </p>
            <button
              type="button"
              className="mt-4 h-10 rounded-full bg-cyan-600 px-5 text-sm font-bold text-white transition hover:bg-cyan-700"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplied={() => {
            sessionStorage.setItem(
              "jobmatchApplicationToast",
              `Application submitted successfully for ${selectedJob.title}.`,
            );
            router.push("/user/applications");
          }}
        />
      )}
    </div>
  );
}
