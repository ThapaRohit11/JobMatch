"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { resumeBuilderData, userProfile } from "../user-data";

const formSections = [
  {
    title: "Personal Information",
    fields: [
      { label: "Full name", value: userProfile.name },
      { label: "Professional title", value: userProfile.role },
      { label: "Email", value: userProfile.email },
      { label: "Phone", value: "+1 415 555 0198" },
      { label: "Location", value: userProfile.location },
      { label: "Portfolio / LinkedIn", value: "linkedin.com/in/johnsmith" },
      { label: "GitHub", value: "github.com/johnsmith" },
    ],
  },
];

const certifications = [
  "Meta Front-End Developer Certificate",
  "AWS Cloud Practitioner",
  "Responsive Web Design Certification",
];

export default function UserResumePage() {
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const [educationCount, setEducationCount] = useState(1);
  const [experienceCount, setExperienceCount] = useState(
    resumeBuilderData.experience.length,
  );
  const [projectCount, setProjectCount] = useState(1);
  const [certificationCount, setCertificationCount] = useState(1);
  const [awardCount, setAwardCount] = useState(1);

  const addButton = (label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 text-sm font-bold text-cyan-700 transition hover:border-cyan-400 hover:bg-cyan-50"
      aria-label={label}
    >
      <span className="text-lg leading-none">+</span>
      {label}
    </button>
  );

  const handleDownload = async () => {
    if (!formRef.current || !previewRef.current) return;

    const nameInput = formRef.current.querySelector("input");
    const candidateName = nameInput?.value.trim() || "resume";
    const safeName =
      candidateName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resume";

    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageHeight = (canvas.height * pageWidth) / canvas.width;
    const pageCount = Math.ceil(imageHeight / pageHeight);

    for (let page = 0; page < pageCount; page += 1) {
      if (page > 0) pdf.addPage();
      pdf.addImage(image, "PNG", 0, -(page * pageHeight), pageWidth, imageHeight);
    }
    pdf.save(`${safeName}-resume.pdf`);
  };

  const handleClear = () => {
    if (!formRef.current) return;

    formRef.current.querySelectorAll("input, textarea").forEach((field) => {
      (field as HTMLInputElement | HTMLTextAreaElement).value = "";
    });
    setEducationCount(1);
    setExperienceCount(1);
    setProjectCount(1);
    setCertificationCount(1);
    setAwardCount(1);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Resume Builder
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Fill in the professional details recruiters expect, then review the
            resume preview before applying.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-12 items-center justify-center rounded-full bg-cyan-600 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
        >
          Download Resume
        </button>
      </div>

      <section className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <form
          ref={formRef}
          className="space-y-5 rounded-3xl border border-cyan-100/80 bg-white p-6 shadow-sm shadow-slate-900/10"
        >
          {formSections.map((section) => (
            <section key={section.title} className="rounded-2xl bg-slate-50 p-5">
              <h2 className="text-lg font-black text-slate-950">
                {section.title}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <label
                    key={field.label}
                    className="text-sm font-bold text-slate-800"
                  >
                    {field.label}
                    <input
                      className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      defaultValue={field.value}
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-black text-slate-950">
              Professional Summary
            </h2>
            <textarea
              className="mt-4 min-h-32 w-full rounded-xl border border-cyan-100 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              defaultValue={resumeBuilderData.summary}
            />
          </section>

          <section className="rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-black text-slate-950">
              Skills
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-slate-800">
                Technical skills
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  defaultValue={userProfile.skills}
                />
              </label>
              <label className="text-sm font-bold text-slate-800">
                Soft skills
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  defaultValue="Communication, ownership, collaboration, problem solving"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">
                Work Experience
              </h2>
              {addButton("Add experience", () =>
                setExperienceCount((count) => count + 1),
              )}
            </div>
            <div className="mt-4 space-y-4">
              {Array.from({ length: experienceCount }, (_, index) => {
                const item = resumeBuilderData.experience[index];
                return (
                <div
                  key={`experience-${index}`}
                  className="grid gap-4 rounded-2xl border border-cyan-100 bg-white p-4 md:grid-cols-2"
                >
                  <label className="text-sm font-bold text-slate-800">
                    Job title
                    <input
                      className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      defaultValue={item?.role ?? ""}
                    />
                  </label>
                  <label className="text-sm font-bold text-slate-800">
                    Company
                    <input
                      className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      defaultValue={item?.company ?? ""}
                    />
                  </label>
                  <label className="text-sm font-bold text-slate-800">
                    Dates
                    <input
                      className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      defaultValue={item?.period ?? ""}
                    />
                  </label>
                  <label className="text-sm font-bold text-slate-800">
                    Location
                    <input
                      className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      defaultValue={
                        item ? (index === 0 ? "Remote" : "San Jose, CA") : ""
                      }
                    />
                  </label>
                  <label className="text-sm font-bold text-slate-800 md:col-span-2">
                    Achievement bullets
                    <textarea
                      className="mt-2 min-h-24 w-full rounded-xl border border-cyan-100 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      defaultValue={
                        item
                          ? `- ${item.detail}\n- Collaborated with designers, backend engineers, and product managers to ship reliable features.\n- Improved accessibility and reusable component quality across the product.`
                          : ""
                      }
                    />
                  </label>
                </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">Projects</h2>
              {addButton("Add project", () =>
                setProjectCount((count) => count + 1),
              )}
            </div>
            <div className="mt-4 space-y-4">
              {Array.from({ length: projectCount }, (_, index) => (
                <textarea
                  key={`project-${index}`}
                  aria-label={`Project ${index + 1}`}
                  placeholder="Describe the project, technologies used, and impact"
                  className="min-h-24 w-full rounded-xl border border-cyan-100 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  defaultValue={index === 0 ? resumeBuilderData.projects : ""}
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">Education</h2>
              {addButton("Add education", () =>
                setEducationCount((count) => count + 1),
              )}
            </div>
            <div className="mt-4 space-y-4">
              {Array.from({ length: educationCount }, (_, index) => (
                <div
                  key={`education-${index}`}
                  className="grid gap-4 rounded-2xl border border-cyan-100 bg-white p-4 md:grid-cols-2"
                >
                  {[
                    ["Degree", index === 0 ? "B.S. Computer Science" : ""],
                    [
                      "School / University",
                      index === 0 ? "Pacific Tech University" : "",
                    ],
                    ["Started date", index === 0 ? "2020" : ""],
                    ["Graduation date", index === 0 ? "2024" : ""],
                    ["GPA / Honors", index === 0 ? "3.8 GPA, Dean's List" : ""],
                  ].map(([label, value]) => (
                    <label
                      key={label}
                      className="text-sm font-bold text-slate-800"
                    >
                      {label}
                      <input
                        className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                        defaultValue={value}
                      />
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">
                Certifications
              </h2>
              {addButton("Add certification", () =>
                setCertificationCount((count) => count + 1),
              )}
            </div>
            <div className="mt-4 space-y-4">
              {Array.from({ length: certificationCount }, (_, index) => (
                <input
                  key={`certification-${index}`}
                  aria-label={`Certification ${index + 1}`}
                  placeholder="Certification name"
                  className="h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  defaultValue={index === 0 ? certifications.join(", ") : ""}
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">
                Awards / Achievements
              </h2>
              {addButton("Add award", () =>
                setAwardCount((count) => count + 1),
              )}
            </div>
            <div className="mt-4 space-y-4">
              {Array.from({ length: awardCount }, (_, index) => (
                <input
                  key={`award-${index}`}
                  aria-label={`Award ${index + 1}`}
                  placeholder="Award or achievement"
                  className="h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  defaultValue={
                    index === 0
                      ? "Hackathon finalist, Dean's List, Open-source contributor"
                      : ""
                  }
                />
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
              Save Resume
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-full border border-cyan-100 bg-white px-7 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50"
            >
              Clear
            </button>
          </div>
        </form>

        <aside
          ref={previewRef}
          className="rounded-3xl border border-cyan-100/80 bg-white p-6 shadow-sm shadow-slate-900/10"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <header className="border-b border-slate-200 pb-5 text-center">
              <h2 className="text-3xl font-black uppercase tracking-wide text-slate-950">
                {userProfile.name}
              </h2>
              <p className="mt-2 text-base font-bold text-cyan-700">
                {userProfile.role}
              </p>
              <p className="mt-3 text-sm font-medium text-slate-500">
                {userProfile.email} | +1 415 555 0198 | {userProfile.location}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                linkedin.com/in/johnsmith | johnsmith.dev
              </p>
            </header>

            <div className="mt-5 space-y-5">
              <section>
                <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                  Professional Summary
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {resumeBuilderData.summary}
                </p>
              </section>

              <section>
                <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                  Skills
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  <span className="font-bold">Technical:</span>{" "}
                  {userProfile.skills}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  <span className="font-bold">Professional:</span>{" "}
                  Communication, ownership, collaboration, problem solving
                </p>
              </section>

              <section>
                <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                  Experience
                </h3>
                <div className="mt-3 space-y-4">
                  {resumeBuilderData.experience.map((item) => (
                    <div key={`${item.role}-${item.company}`}>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-black text-slate-950">
                            {item.role}
                          </p>
                          <p className="text-sm font-bold text-slate-600">
                            {item.company}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-500">
                          {item.period}
                        </p>
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                        <li>{item.detail}</li>
                        <li>
                          Collaborated with design and engineering teams to
                          ship reliable, accessible product features.
                        </li>
                        <li>
                          Improved reusable component quality and reduced
                          repeated UI implementation work.
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                  Projects
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {resumeBuilderData.projects}
                </p>
              </section>

              <section>
                <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                  Education
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  <span className="font-bold">B.S. Computer Science</span>,
                  Pacific Tech University, 2024
                </p>
              </section>

              <section>
                <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                  Certifications
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {certifications.join(" | ")}
                </p>
              </section>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
