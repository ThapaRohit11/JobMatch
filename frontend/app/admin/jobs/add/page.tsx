"use client";

import Link from "next/link";
import { useState } from "react";
import { companies } from "../../admin-data";
import { Card, PageHeader } from "../../components";

const fields = [
  { label: "Job title", placeholder: "Senior Frontend Engineer" },
  { label: "Salary", placeholder: "$135K - $165K" },
  { label: "Skills", placeholder: "React, TypeScript, Tailwind CSS" },
];

export default function AddJobPage() {
  const [selectedCompanyName, setSelectedCompanyName] = useState(
    companies[0]?.name ?? "",
  );
  const selectedCompany = companies.find(
    (company) => company.name === selectedCompanyName,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Job"
        description="Publish a new role with matching criteria so candidates can discover relevant opportunities."
        action={
          <Link
            href="/admin/jobs"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-cyan-100 bg-white px-5 text-sm font-bold text-cyan-700 shadow-sm transition hover:bg-cyan-50"
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
          </Link>
        }
      />
      <Card>
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
                placeholder={field.placeholder}
              />
            </label>
          ))}
          <label className="block text-sm font-bold text-slate-800">
            Job type
            <select className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-slate-800 lg:col-span-2">
            Description
            <textarea
              className="mt-2 min-h-36 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              placeholder="Describe the role, responsibilities, requirements, and interview process."
            />
          </label>
          <div className="lg:col-span-2">
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition hover:bg-cyan-700">
              Publish Job
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
