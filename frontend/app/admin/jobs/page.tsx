"use client";

import Link from "next/link";
import { useState } from "react";
import { companies, jobs } from "../admin-data";

type Job = (typeof jobs)[number];

function statusClasses(status: string) {
  return status === "Open"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-slate-100 text-slate-600";
}

function typeClasses(type: string) {
  if (type === "Hybrid") {
    return "bg-indigo-50 text-indigo-700";
  }

  return "bg-cyan-50 text-cyan-700";
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="inline-flex h-11 items-center gap-2 rounded-full border border-cyan-100 bg-white px-5 text-sm font-bold text-cyan-700 shadow-sm transition hover:bg-cyan-50"
      onClick={onClick}
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      Back to Jobs
    </button>
  );
}

function EditJobForm({
  job,
  onBack,
}: {
  job: Job;
  onBack: () => void;
}) {
  const [selectedCompanyName, setSelectedCompanyName] = useState(job.company);
  const selectedCompany =
    companies.find((company) => company.name === selectedCompanyName) ??
    companies[0];
  const fields = [
    { label: "Job title", value: job.title },
    { label: "Salary", value: job.salary },
    { label: "Skills", value: "React, TypeScript, Tailwind CSS" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Edit Job
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Update the selected job details and keep the listing accurate for
            candidates.
          </p>
        </div>
        <BackButton onClick={onBack} />
      </div>

      <section className="rounded-2xl border border-cyan-100/80 bg-white p-6 shadow-sm shadow-cyan-900/5">
        <form className="grid gap-5 lg:grid-cols-2">
          <label className="block text-sm font-bold text-slate-800">
            Company name
            <select
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              value={selectedCompanyName}
              onChange={(event) => setSelectedCompanyName(event.target.value)}
            >
              {companies.map((company) => (
                <option key={company.name} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold text-slate-800">
            Location
            <input
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-slate-50 px-4 font-semibold text-slate-500 outline-none"
              readOnly
              value={selectedCompany?.location ?? ""}
            />
          </label>
          {fields.map((field) => (
            <label
              key={field.label}
              className="block text-sm font-bold text-slate-800"
            >
              {field.label}
              <input
                className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                defaultValue={field.value}
              />
            </label>
          ))}
          <label className="block text-sm font-bold text-slate-800">
            Job type
            <select
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              defaultValue={job.type}
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-slate-800 lg:col-span-2">
            Description
            <textarea
              className="mt-2 min-h-36 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              defaultValue={`${selectedCompanyName} is hiring a ${job.title}. This role is ${job.type.toLowerCase()} and based in ${selectedCompany?.location ?? job.location}.`}
            />
          </label>
          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition hover:bg-cyan-700">
              Save Changes
            </button>
            <button
              type="button"
              className="h-12 rounded-full border border-cyan-100 bg-white px-7 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50"
              onClick={onBack}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DeleteJobModal({
  job,
  onCancel,
}: {
  job: Job;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
      <button
        aria-label="Cancel delete"
        className="absolute inset-0 cursor-default"
        onClick={onCancel}
      />
      <section className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-600">
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6 18 20H6L5 6" />
            <path d="M10 11v5" />
            <path d="M14 11v5" />
          </svg>
        </div>
        <h2 className="mt-5 text-2xl font-black text-slate-950">
          Delete job post?
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-bold text-slate-900">{job.title}</span> from{" "}
          <span className="font-bold text-slate-900">{job.company}</span>? This
          action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="h-11 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="h-11 rounded-full bg-rose-600 px-5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700"
            onClick={onCancel}
          >
            Confirm Delete
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AdminJobsPage() {
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const openJobs = jobs.filter((job) => job.status === "Open").length;
  const totalApplicants = jobs.reduce((total, job) => total + job.applicants, 0);

  if (editingJob) {
    return (
      <EditJobForm job={editingJob} onBack={() => setEditingJob(null)} />
    );
  }

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
            placeholder="Search by job title, company, or location..."
          />
        </div>

        <div className="xl:flex">
          <Link
            href="/admin/jobs/add"
            className="inline-flex h-16 items-center justify-center gap-2 rounded-3xl bg-cyan-600 px-6 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
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
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add Job
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-indigo-700">
            Total Applications
          </p>
          <p className="mt-2 text-3xl font-black text-indigo-700">
            {totalApplicants}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left">
            <thead className="bg-slate-50 text-sm font-bold text-slate-500">
              <tr>
                <th className="px-8 py-5">Job</th>
                <th className="px-8 py-5">Company / Location</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Salary</th>
                <th className="px-8 py-5 text-center">Applicants</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.title} className="transition hover:bg-cyan-50/35">
                  <td className="px-8 py-6">
                    <p className="text-lg font-black text-slate-950">
                      {job.title}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                      Posted {job.posted}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-xs font-black text-white">
                        {job.logo}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {job.company}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-400">
                          {job.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-black ${typeClasses(job.type)}`}
                    >
                      {job.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-700">
                    {job.salary}
                  </td>
                  <td className="px-8 py-6 text-center text-lg font-black text-blue-600">
                    {job.applicants}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClasses(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <button
                        aria-label={`Edit ${job.title}`}
                        className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-700"
                        onClick={() => setEditingJob(job)}
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
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>
                      <button
                        aria-label={`Delete ${job.title}`}
                        className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => setDeletingJob(job)}
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
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6 18 20H6L5 6" />
                          <path d="M10 11v5" />
                          <path d="M14 11v5" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {deletingJob && (
        <DeleteJobModal
          job={deletingJob}
          onCancel={() => setDeletingJob(null)}
        />
      )}
    </div>
  );
}
