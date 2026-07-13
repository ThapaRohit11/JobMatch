"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCompany,
  createAdminJob,
  getAdminCompanies,
} from "../../../../lib/admin-api";
import { Card, PageHeader } from "../../components";

const fields = [
  { label: "Job title", placeholder: "Senior Frontend Engineer" },
  { label: "Salary", placeholder: "$135K - $165K" },
  { label: "Skills", placeholder: "React, TypeScript, Tailwind CSS" },
];

export default function AddJobPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [message, setMessage] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState(
    "",
  );
  const selectedCompany = companies.find(
    (company) => company.name === selectedCompanyName,
  );

  useEffect(() => {
    getAdminCompanies().then((data) => {
      setCompanies(data.companies);
      setSelectedCompanyName(data.companies[0]?.name ?? "");
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await createAdminJob({
      company: selectedCompanyName,
      title: String(formData.get("title") || ""),
      salary: String(formData.get("salary") || ""),
      skills: String(formData.get("skills") || ""),
      type: String(formData.get("type") || ""),
      applyBy: String(formData.get("applyBy") || ""),
      description: String(formData.get("description") || ""),
      responsibilities: String(formData.get("responsibilities") || ""),
      requirements: String(formData.get("requirements") || ""),
      benefits: String(formData.get("benefits") || ""),
    });
    setMessage("Job published successfully");
    router.push("/admin/jobs");
  }

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
        <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
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
                name={field.label === "Job title" ? "title" : field.label.toLowerCase()}
                className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                placeholder={field.placeholder}
                required={field.label !== "Skills"}
              />
            </label>
          ))}
          <label className="block text-sm font-bold text-slate-800">
            Job type
            <select name="type" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-slate-800">
            Apply by
            <input
              name="applyBy"
              type="date"
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <label className="block text-sm font-bold text-slate-800 lg:col-span-2">
            Job description
            <textarea
              name="description"
              className="mt-2 min-h-36 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              placeholder="Describe the role and what the candidate will work on."
            />
          </label>
          <label className="block text-sm font-bold text-slate-800 lg:col-span-2">
            Responsibilities
            <textarea
              name="responsibilities"
              className="mt-2 min-h-32 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              placeholder={"Enter each responsibility on a new line"}
            />
          </label>
          <label className="block text-sm font-bold text-slate-800 lg:col-span-2">
            Requirements
            <textarea
              name="requirements"
              className="mt-2 min-h-32 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              placeholder={"Enter each requirement on a new line"}
            />
          </label>
          <label className="block text-sm font-bold text-slate-800 lg:col-span-2">
            Benefits
            <textarea
              name="benefits"
              className="mt-2 min-h-28 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              placeholder={"Enter each benefit on a new line"}
            />
          </label>
          <div className="lg:col-span-2">
            {message && (
              <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                {message}
              </p>
            )}
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition hover:bg-cyan-700">
              Publish Job
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
