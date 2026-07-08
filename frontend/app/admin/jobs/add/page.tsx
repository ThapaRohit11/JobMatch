import { Card, ConfirmationStrip, PageHeader } from "../../components";

const fields = [
  { label: "Company name", placeholder: "BluePeak Labs" },
  { label: "Job title", placeholder: "Senior Frontend Engineer" },
  { label: "Salary", placeholder: "$135K - $165K" },
  { label: "Location", placeholder: "Remote, United States" },
  { label: "Skills", placeholder: "React, TypeScript, Tailwind CSS" },
];

export default function AddJobPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Job"
        description="Publish a new role with matching criteria so candidates can discover relevant opportunities."
      />
      <Card>
        <form className="grid gap-5 lg:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.label}
              className="block text-sm font-bold text-slate-800"
            >
              {field.label}
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-blue-50/30 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder={field.placeholder}
              />
            </label>
          ))}
          <label className="block text-sm font-bold text-slate-800">
            Job type
            <select className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
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
              className="mt-2 min-h-36 w-full rounded-2xl border border-blue-100 bg-blue-50/30 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Describe the role, responsibilities, requirements, and interview process."
            />
          </label>
          <div className="lg:col-span-2">
            <button className="h-12 rounded-full bg-blue-600 px-7 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition hover:bg-blue-700">
              Publish Job
            </button>
          </div>
        </form>
      </Card>
      <ConfirmationStrip type="success" />
    </div>
  );
}
