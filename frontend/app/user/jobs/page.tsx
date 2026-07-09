"use client";

import { useState } from "react";
import { jobs } from "../../admin/admin-data";

type Job = (typeof jobs)[number];

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

const jobDetails: Record<
  string,
  {
    description: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    deadline: string;
  }
> = {
  "Senior Frontend Engineer": {
    description:
      "Build fast, accessible product interfaces for candidate matching, resume insights, and recruiter workflows.",
    responsibilities: [
      "Create polished React and TypeScript features for high-traffic dashboards.",
      "Partner with product and design to improve job discovery flows.",
      "Keep frontend performance, accessibility, and component quality high.",
    ],
    requirements: [
      "Strong React, TypeScript, and modern CSS experience.",
      "Experience building reusable UI components and data-heavy screens.",
      "Comfort working with APIs, state, and production debugging.",
    ],
    benefits: [
      "Remote-first team",
      "Health and wellness coverage",
      "Learning budget",
      "Flexible working hours",
    ],
    deadline: "Jul 28, 2026",
  },
  "Product Designer": {
    description:
      "Design intuitive hiring and candidate experiences that make resume feedback and job matching simple to use.",
    responsibilities: [
      "Create flows, wireframes, and polished product screens.",
      "Run lightweight user research and turn findings into improvements.",
      "Maintain visual consistency across web and dashboard experiences.",
    ],
    requirements: [
      "Strong product design portfolio for SaaS or marketplace products.",
      "Comfort with Figma, design systems, and cross-functional delivery.",
      "Ability to simplify complex workflows into clear interfaces.",
    ],
    benefits: [
      "Hybrid work setup",
      "Design tools budget",
      "Paid time off",
      "Career growth support",
    ],
    deadline: "Jul 25, 2026",
  },
  "Data Analyst": {
    description:
      "Analyze candidate, resume, and job-market data to improve match quality and product decisions.",
    responsibilities: [
      "Build dashboards for application and matching performance.",
      "Find patterns in user behavior and job-market trends.",
      "Share clear insights with product, engineering, and operations.",
    ],
    requirements: [
      "Strong SQL and spreadsheet analysis skills.",
      "Experience with BI dashboards and product metrics.",
      "Ability to explain data findings clearly to non-technical teams.",
    ],
    benefits: [
      "Hybrid office schedule",
      "Analytics tooling budget",
      "Mentorship program",
      "Team wellness benefits",
    ],
    deadline: "Jul 22, 2026",
  },
  "Talent Operations Lead": {
    description:
      "Own candidate operations and help keep applications, resume reviews, and job postings moving smoothly.",
    responsibilities: [
      "Coordinate application review workflows and candidate updates.",
      "Improve operational processes for resume and job matching teams.",
      "Track quality metrics and remove bottlenecks across hiring flows.",
    ],
    requirements: [
      "Experience in recruiting operations, talent, or HR technology.",
      "Strong communication and process management skills.",
      "Comfort working with dashboards, reports, and support workflows.",
    ],
    benefits: [
      "Health coverage",
      "Operations leadership path",
      "Flexible schedule",
      "Commuter support",
    ],
    deadline: "Jul 24, 2026",
  },
};

function JobDetailsModal({
  job,
  onClose,
}: {
  job: Job;
  onClose: () => void;
}) {
  const details = jobDetails[job.title] ?? jobDetails["Senior Frontend Engineer"];

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
                {details.deadline}
              </p>
            </div>
          </div>

          <section className="rounded-2xl border border-cyan-100 bg-white p-5">
            <h3 className="text-lg font-black text-slate-950">
              Job Description
            </h3>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              {details.description}
            </p>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-cyan-50/70 p-5">
              <h3 className="text-lg font-black text-slate-950">
                Responsibilities
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-6 text-slate-700">
                {details.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-indigo-50/70 p-5">
              <h3 className="text-lg font-black text-slate-950">
                Requirements
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-6 text-slate-700">
                {details.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-2xl bg-emerald-50/80 p-5">
            <h3 className="text-lg font-black text-slate-950">Benefits</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {details.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-700"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            className="h-11 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="h-11 rounded-full bg-cyan-600 px-6 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
            onClick={onClose}
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default function UserJobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const openJobs = jobs.filter((job) => job.status === "Open").length;

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
            placeholder="Search jobs by title, company, or location..."
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
        {jobs.map((job) => (
          <article
            key={job.title}
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
                  {jobDetails[job.title]?.deadline ?? "Jul 28, 2026"}
                </p>
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
      </section>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
