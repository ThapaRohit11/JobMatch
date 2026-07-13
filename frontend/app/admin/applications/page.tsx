"use client";

import { useEffect, useState } from "react";
import {
  AdminApplication,
  AdminResume,
  getAdminApplications,
  getAdminResumes,
  updateAdminApplication,
} from "../../../lib/admin-api";

type Application = AdminApplication;
type ApplicationStatus = "Pending" | "In Review" | "Accepted" | "Rejected";
type Resume = AdminResume;

/* Legacy placeholder resume data retained only for migration reference.
const candidateResumeDetails: Record<
  string,
  {
    summary: string;
    skills: string;
    experience: string;
    education: string;
  }
> = {
  "maya.chen@email.com": {
    summary:
      "Product manager experienced in turning customer insights into clear product strategy and measurable launches.",
    skills: "Product strategy, Roadmapping, Analytics, Agile, User research",
    experience:
      "Led cross-functional product launches and improved feature adoption through customer research and data-informed prioritization.",
    education: "B.S. Business Administration — University of California",
  },
  "aarav.sharma@email.com": {
    summary:
      "Backend engineer focused on reliable APIs, scalable services, and secure cloud infrastructure.",
    skills: "Node.js, Python, PostgreSQL, AWS, Docker, REST APIs",
    experience:
      "Built and maintained production services, improved API performance, and strengthened monitoring across distributed systems.",
    education: "B.S. Computer Science — Pacific Tech University",
  },
  "sofia.reed@email.com": {
    summary:
      "UX researcher who turns qualitative and quantitative findings into practical improvements for digital products.",
    skills: "User interviews, Usability testing, Figma, Research synthesis",
    experience:
      "Planned research studies, facilitated usability sessions, and partnered with design teams to improve core user journeys.",
    education: "M.S. Human-Computer Interaction — State University",
  },
  "noah.kim@email.com": {
    summary:
      "Data scientist experienced in predictive modeling, experimentation, and communicating actionable insights.",
    skills: "Python, SQL, Machine learning, Tableau, Statistics",
    experience:
      "Developed forecasting models and analytics dashboards that helped product teams make faster, evidence-based decisions.",
    education: "M.S. Data Science — San Francisco University",
  },
};
*/

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

  if (status === "Pending") {
    return "border-amber-100 bg-amber-50 text-amber-700";
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

  if (status === "Pending") {
    return "bg-amber-500";
  }

  return "bg-rose-500";
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
}

function scoreBarColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 70) return "bg-blue-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-rose-500";
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
  const experiences = resume?.experience ?? [];
  const projects = resume?.projects ?? [];
  const educationEntries = resume?.educationEntries ?? [];
  const certifications = resume?.certifications ?? [];
  const awards = resume?.awards ?? [];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
      <button
        aria-label="Close resume details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
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
                  {resume.analysis && (
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700">
                      {resume.analysis.label}
                    </span>
                  )}
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

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <header className="border-b border-slate-200 pb-5 text-center">
                  <h3 className="text-2xl font-black uppercase tracking-wide text-slate-950">
                    {resume.candidate}
                  </h3>
                  <p className="mt-1 font-bold text-cyan-700">{resume.role}</p>
                  <p className="hidden">
                    {resume.email} · {application.location}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {[
                      resume.contactEmail || resume.email,
                      resume.phone,
                      resume.location || application.location,
                    ]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                  {(resume.portfolio || resume.github) && (
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {[resume.portfolio, resume.github]
                        .filter(Boolean)
                        .join(" | ")}
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
                  <p className="border-t border-slate-100 pt-3 text-xs font-semibold text-slate-400">
                    Uploaded {resume.uploaded} · Last updated {resume.updated}
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [applicationStatuses, setApplicationStatuses] = useState<
    Record<string, ApplicationStatus>
  >({});

  useEffect(() => {
    Promise.all([getAdminApplications(), getAdminResumes()]).then(
      ([applicationsData, resumesData]) => {
        setApplications(applicationsData.applications);
        setResumes(resumesData.resumes);
        setApplicationStatuses(
          Object.fromEntries(
            applicationsData.applications.map((application: Application) => [
              application.id,
              application.status,
            ]),
          ),
        );
      },
    );
  }, []);
  const statusValues = Object.values(applicationStatuses);
  const pending = statusValues.filter((status) => status === "Pending").length;
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-blue-600">Total Applications</p>
          <p className="mt-2 text-3xl font-black text-blue-700">
            {applications.length}
          </p>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-amber-700">Pending</p>
          <p className="mt-2 text-3xl font-black text-amber-700">{pending}</p>
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
                const applicationKey = application.id;
                const currentStatus =
                  applicationStatuses[applicationKey] ?? "Pending";

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
                        onChange={async (event) => {
                          const status = event.target.value as ApplicationStatus;
                          setApplicationStatuses((current) => ({
                            ...current,
                            [applicationKey]: status,
                          }));
                          const data = await updateAdminApplication(application.id, status);
                          setApplications((current) =>
                            current.map((item) =>
                              item.id === data.application.id ? data.application : item,
                            ),
                          );
                        }}
                      >
                        <option value="Pending">Pending</option>
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
              selectedApplication.id
            ] ?? "Pending"
          }
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
