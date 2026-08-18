"use client";

import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { getUserResume, saveUserResume, UserProfile } from "../../../lib/user-api";

const resumeSections = [
  { label: "Personal info", id: "personal-info" },
  { label: "Summary", id: "summary" },
  { label: "Work experience", id: "work-experience" },
  { label: "Education", id: "education" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Certifications", id: "certifications" },
  { label: "Awards", id: "awards" },
];

export default function UserResumePage() {
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    role: "",
    location: "",
    joined: "",
    resumeScore: 0,
    resumeLabel: "No resume",
    skills: "",
  });
  const [resumeBuilderData, setResumeBuilderData] = useState({
    fullName: "",
    contactEmail: "",
    role: "",
    phone: "",
    location: "",
    portfolio: "",
    github: "",
    summary: "",
    skills: "",
    softSkills: "",
    experience: [] as Array<{ role: string; company: string; period: string; location: string; detail: string }>,
    education: [] as Array<{ degree: string; school: string; started: string; graduation: string; gpa: string }>,
    projects: [] as string[],
    certifications: [] as string[],
    awards: [] as string[],
  });
  const [message, setMessage] = useState("");
  const experienceIdCounter = useRef(0);
  const [experienceIds, setExperienceIds] = useState<number[]>([0]);
  const educationIdCounter = useRef(0);
  const [educationIds, setEducationIds] = useState<number[]>([0]);
  const projectIdCounter = useRef(0);
  const [projectIds, setProjectIds] = useState<number[]>([0]);
  const certificationIdCounter = useRef(0);
  const [certificationIds, setCertificationIds] = useState<number[]>([0]);
  const awardIdCounter = useRef(0);
  const [awardIds, setAwardIds] = useState<number[]>([0]);
  const [activeSection, setActiveSection] = useState("personal-info");

  function newIds(counterRef: { current: number }, count: number) {
    return Array.from({ length: count }, () => counterRef.current++);
  }

  function removeItem(setIds: Dispatch<SetStateAction<number[]>>, id: number) {
    setIds((ids) => ids.filter((existingId) => existingId !== id));
  }

  useEffect(() => {
    getUserResume().then((data) => {
      setUserProfile(data.profile);
      setResumeBuilderData({
        fullName: data.resume.fullName || data.profile.name || "",
        contactEmail: data.resume.contactEmail || data.profile.email || "",
        role: data.resume.role || data.profile.role || "",
        phone: data.resume.phone || "",
        location: data.resume.location || data.profile.location || "",
        portfolio: data.resume.portfolio || "",
        github: data.resume.github || "",
        summary: data.resume.summary || "",
        experience: data.resume.experience || [],
        education: data.resume.educationEntries || [],
        projects: data.resume.projects || [],
        skills: data.resume.skills || data.profile.skills || "",
        softSkills: data.resume.softSkills || "",
        certifications: data.resume.certifications || [],
        awards: data.resume.awards || [],
      });
      setExperienceIds(newIds(experienceIdCounter, Math.max(data.resume.experience?.length || 1, 1)));
      setEducationIds(newIds(educationIdCounter, Math.max(data.resume.educationEntries?.length || 1, 1)));
      setProjectIds(newIds(projectIdCounter, Math.max(data.resume.projects?.length || 1, 1)));
      setCertificationIds(newIds(certificationIdCounter, Math.max(data.resume.certifications?.length || 1, 1)));
      setAwardIds(newIds(awardIdCounter, Math.max(data.resume.awards?.length || 1, 1)));
    }).catch((error) => {
      setMessage(error instanceof Error ? error.message : "Unable to load your resume");
    });
  }, []);

  const formSections = [
    {
      title: "Personal Information",
      fields: [
        { label: "Full name", name: "fullName", value: userProfile.name, readOnly: true },
        { label: "Email", name: "contactEmail", value: userProfile.email, readOnly: true },
        { label: "Professional title", name: "role", value: resumeBuilderData.role || userProfile.role },
        { label: "Phone", name: "phone", value: resumeBuilderData.phone },
        { label: "Location", name: "location", value: resumeBuilderData.location || userProfile.location },
        { label: "Portfolio / LinkedIn", name: "portfolio", value: resumeBuilderData.portfolio },
        { label: "GitHub", name: "github", value: resumeBuilderData.github },
      ],
    },
  ];

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

    const resumeElement = previewRef.current;
    const originalWidth = resumeElement.style.width;
    const originalMaxWidth = resumeElement.style.maxWidth;
    resumeElement.style.width = "794px";
    resumeElement.style.maxWidth = "none";

    const renderedWidth = resumeElement.offsetWidth;
    const resumeRect = resumeElement.getBoundingClientRect();
    const sectionRanges = Array.from(
      resumeElement.querySelectorAll<HTMLElement>("[data-resume-section]"),
    ).map((section) => {
      const rect = section.getBoundingClientRect();
      return {
        top: rect.top - resumeRect.top,
        bottom: rect.bottom - resumeRect.top,
      };
    });

    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(resumeElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
    } finally {
      resumeElement.style.width = originalWidth;
      resumeElement.style.maxWidth = originalMaxWidth;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;
    const pagePixelHeight = (contentHeight / contentWidth) * canvas.width;
    const renderScale = canvas.width / renderedWidth;
    let sliceStart = 0;
    let page = 0;

    while (sliceStart < canvas.height) {
      const idealEnd = Math.min(sliceStart + pagePixelHeight, canvas.height);
      const crossingSection = sectionRanges.find((range) => {
        const top = range.top * renderScale;
        const bottom = range.bottom * renderScale;
        return top < idealEnd && bottom > idealEnd;
      });
      const sectionStart = crossingSection
        ? crossingSection.top * renderScale
        : idealEnd;
      const canMoveSection =
        crossingSection && sectionStart > sliceStart + pagePixelHeight * 0.2;
      const sliceEnd = Math.max(
        sliceStart + 1,
        Math.floor(canMoveSection ? sectionStart - 8 * renderScale : idealEnd),
      );
      const sliceHeight = Math.min(sliceEnd, canvas.height) - sliceStart;
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const context = pageCanvas.getContext("2d");

      if (!context) return;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      context.drawImage(
        canvas,
        0,
        sliceStart,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight,
      );

      if (page > 0) pdf.addPage();
      const imageHeight = (sliceHeight / canvas.width) * contentWidth;
      pdf.addImage(
        pageCanvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        margin,
        margin,
        contentWidth,
        imageHeight,
      );
      sliceStart += sliceHeight;
      page += 1;
    }
    pdf.save(`${safeName}-resume.pdf`);
  };

  const handleClear = () => {
    if (!formRef.current) return;

    formRef.current
      .querySelectorAll("input:not([readonly]), textarea")
      .forEach((field) => {
      (field as HTMLInputElement | HTMLTextAreaElement).value = "";
      });
    setResumeBuilderData((current) => ({
      ...current,
      phone: "",
      location: "",
      portfolio: "",
      github: "",
      summary: "",
      skills: "",
      softSkills: "",
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      awards: [],
    }));
    setExperienceIds(newIds(experienceIdCounter, 1));
    setEducationIds(newIds(educationIdCounter, 1));
    setProjectIds(newIds(projectIdCounter, 1));
    setCertificationIds(newIds(certificationIdCounter, 1));
    setAwardIds(newIds(awardIdCounter, 1));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const inputValue = (name: string) =>
      formRef.current?.querySelector<HTMLInputElement>(`[name='${name}']`)?.value.trim() || "";
    const summary = formRef.current.querySelector<HTMLTextAreaElement>("[name='summary']")?.value || "";
    const skills = inputValue("technicalSkills");
    const softSkills = inputValue("softSkills");
    const projects = Array.from({ length: projectIds.length }, (_, index) =>
      formRef.current?.querySelector<HTMLTextAreaElement>(`[name='project-${index}']`)?.value.trim() || "",
    ).filter(Boolean);
    const education = Array.from({ length: educationIds.length }, (_, index) => ({
      degree: inputValue(`educationDegree-${index}`),
      school: inputValue(`educationSchool-${index}`),
      started: inputValue(`educationStarted-${index}`),
      graduation: inputValue(`educationGraduation-${index}`),
      gpa: inputValue(`educationGpa-${index}`),
    })).filter((item) => Object.values(item).some(Boolean));
    const experience = Array.from({ length: experienceIds.length }, (_, index) => ({
      role: inputValue(`experienceRole-${index}`),
      company: inputValue(`experienceCompany-${index}`),
      period: inputValue(`experiencePeriod-${index}`),
      location: inputValue(`experienceLocation-${index}`),
      detail: formRef.current?.querySelector<HTMLTextAreaElement>(`[name='experienceDetail-${index}']`)?.value || "",
    })).filter((item) => Object.values(item).some(Boolean));
    const certifications = Array.from(
      { length: certificationIds.length },
      (_, index) => inputValue(`certification-${index}`),
    ).filter(Boolean);
    const awards = Array.from(
      { length: awardIds.length },
      (_, index) => inputValue(`award-${index}`),
    ).filter(Boolean);

    try {
      const payload = {
        fullName: inputValue("fullName"),
        contactEmail: inputValue("contactEmail"),
        role: inputValue("role"),
        phone: inputValue("phone"),
        location: inputValue("location"),
        portfolio: inputValue("portfolio"),
        github: inputValue("github"),
        summary,
        projects,
        education,
        experience,
        skills,
        softSkills,
        certifications,
        awards,
      };
      const data = await saveUserResume(payload);
      setResumeBuilderData(payload);
      setMessage(`Resume analyzed and saved: ${data.resume.score}/100 (${data.resume.analysis.label})`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save resume");
    }
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

      <section className="grid gap-6 2xl:grid-cols-[190px_minmax(0,1fr)_minmax(380px,0.9fr)]">
        <aside className="hidden 2xl:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-3 pt-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Resume sections</p>
            {resumeSections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                aria-current={activeSection === section.id ? "true" : undefined}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold transition ${activeSection === section.id ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <span className="text-slate-400">{String(index + 1).padStart(2, "0")}</span>{section.label}
              </button>
            ))}
          </div>
        </aside>
        <form
          ref={formRef}
          onSubmit={handleSave}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 lg:p-6"
        >
          {formSections.map((section) => (
            <section id="personal-info" key={section.title} className="scroll-mt-24 rounded-2xl bg-slate-50 p-5">
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
                      name={field.name}
                      readOnly={field.readOnly}
                      className={`mt-2 h-12 w-full rounded-xl border border-cyan-100 px-4 outline-none transition ${
                        field.readOnly
                          ? "cursor-not-allowed bg-slate-100 text-slate-500"
                          : "bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      }`}
                      value={field.value ?? ""}
                      onChange={(event) => {
                        if (!field.readOnly) {
                          setResumeBuilderData((current) => ({
                            ...current,
                            [field.name]: event.target.value,
                          }));
                        }
                      }}
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}

          <section id="summary" className="scroll-mt-24 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-black text-slate-950">
              Professional Summary
            </h2>
            <textarea
              name="summary"
              className="mt-4 min-h-32 w-full rounded-xl border border-cyan-100 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              defaultValue={resumeBuilderData.summary}
            />
          </section>

          <section id="skills" className="scroll-mt-24 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-black text-slate-950">
              Skills
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-slate-800">
                Technical skills
                <input
                  name="technicalSkills"
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  defaultValue={resumeBuilderData.skills || userProfile.skills}
                />
              </label>
              <label className="text-sm font-bold text-slate-800">
                Soft skills
                <input
                  name="softSkills"
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  defaultValue={resumeBuilderData.softSkills}
                />
              </label>
            </div>
          </section>

          <section id="work-experience" className="scroll-mt-24 rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">
                Work Experience
              </h2>
              {addButton("Add experience", () =>
                setExperienceIds((ids) => [...ids, experienceIdCounter.current++]),
              )}
            </div>
            <div className="mt-4 space-y-4">
              {experienceIds.map((id, index) => {
                const item = resumeBuilderData.experience[index];
                return (
                <div
                  key={id}
                  className="grid gap-4 rounded-2xl border border-cyan-100 bg-white p-4 md:grid-cols-2"
                >
                  <div className="flex items-center justify-between md:col-span-2">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Experience {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(setExperienceIds, id)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <label className="text-sm font-bold text-slate-800">
                    Job title
                    <input
                      className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      name={`experienceRole-${index}`}
                      defaultValue={item?.role ?? ""}
                    />
                  </label>
                  <label className="text-sm font-bold text-slate-800">
                    Company
                    <input
                      className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      name={`experienceCompany-${index}`}
                      defaultValue={item?.company ?? ""}
                    />
                  </label>
                  <label className="text-sm font-bold text-slate-800">
                    Dates
                    <input
                      className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      name={`experiencePeriod-${index}`}
                      defaultValue={item?.period ?? ""}
                    />
                  </label>
                  <label className="text-sm font-bold text-slate-800">
                    Location
                    <input
                      name={`experienceLocation-${index}`}
                      className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      defaultValue={item?.location ?? ""}
                    />
                  </label>
                  <label className="text-sm font-bold text-slate-800 md:col-span-2">
                    Achievement bullets
                    <textarea
                      className="mt-2 min-h-24 w-full rounded-xl border border-cyan-100 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      name={`experienceDetail-${index}`}
                      defaultValue={
                        item
                          ? item.detail
                          : ""
                      }
                    />
                  </label>
                </div>
                );
              })}
            </div>
          </section>

          <section id="projects" className="scroll-mt-24 rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">Projects</h2>
              {addButton("Add project", () =>
                setProjectIds((ids) => [...ids, projectIdCounter.current++]),
              )}
            </div>
            <div className="mt-4 space-y-4">
              {projectIds.map((id, index) => (
                <div
                  key={id}
                  className="rounded-2xl border border-cyan-100 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Project {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(setProjectIds, id)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    aria-label={`Project ${index + 1}`}
                    placeholder="Describe the project, technologies used, and impact"
                    name={`project-${index}`}
                    className="mt-2 min-h-24 w-full rounded-xl border border-cyan-100 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    defaultValue={resumeBuilderData.projects[index] ?? ""}
                  />
                </div>
              ))}
            </div>
          </section>

          <section id="education" className="scroll-mt-24 rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">Education</h2>
              {addButton("Add education", () =>
                setEducationIds((ids) => [...ids, educationIdCounter.current++]),
              )}
            </div>
            <div className="mt-4 space-y-4">
              {educationIds.map((id, index) => (
                <div
                  key={id}
                  className="rounded-2xl border border-cyan-100 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Education {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(setEducationIds, id)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 grid gap-4 md:grid-cols-2">
                  {[
                    { label: "School / University", name: "School", value: resumeBuilderData.education[index]?.school },
                    { label: "Course / Degree (+2, Bachelor, Master)", name: "Degree", value: resumeBuilderData.education[index]?.degree },
                    { label: "Started date", name: "Started", value: resumeBuilderData.education[index]?.started },
                    { label: "Graduation date", name: "Graduation", value: resumeBuilderData.education[index]?.graduation },
                    { label: "GPA / Honors", name: "Gpa", value: resumeBuilderData.education[index]?.gpa },
                  ].map(({ label, name, value }) => (
                    <label
                      key={label}
                      className="text-sm font-bold text-slate-800"
                    >
                      {label}
                      <input
                        name={`education${name}-${index}`}
                        className="mt-2 h-11 w-full rounded-xl border border-cyan-100 px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                        defaultValue={value ?? ""}
                      />
                    </label>
                  ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="certifications" className="scroll-mt-24 rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">
                Certifications
              </h2>
              {addButton("Add certification", () =>
                setCertificationIds((ids) => [...ids, certificationIdCounter.current++]),
              )}
            </div>
            <div className="mt-4 space-y-3">
              {certificationIds.map((id, index) => (
                <div key={id} className="flex items-center gap-3">
                  <input
                    aria-label={`Certification ${index + 1}`}
                    name={`certification-${index}`}
                    placeholder="Certification name"
                    className="h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    defaultValue={resumeBuilderData.certifications[index] ?? ""}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(setCertificationIds, id)}
                    aria-label={`Remove certification ${index + 1}`}
                    className="shrink-0 text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section id="awards" className="scroll-mt-24 rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">
                Awards / Achievements
              </h2>
              {addButton("Add award", () =>
                setAwardIds((ids) => [...ids, awardIdCounter.current++]),
              )}
            </div>
            <div className="mt-4 space-y-3">
              {awardIds.map((id, index) => (
                <div key={id} className="flex items-center gap-3">
                  <input
                    aria-label={`Award ${index + 1}`}
                    name={`award-${index}`}
                    placeholder="Award or achievement"
                    className="h-12 w-full rounded-xl border border-cyan-100 bg-white px-4 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    defaultValue={resumeBuilderData.awards[index] ?? ""}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(setAwardIds, id)}
                    aria-label={`Remove award ${index + 1}`}
                    className="shrink-0 text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            {message && (
              <p className="w-full rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                {message}
              </p>
            )}
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

        <aside className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <div><p className="text-sm font-black text-slate-900">Live preview</p><p className="text-xs font-medium text-slate-500">Modern · ATS Friendly</p></div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Auto-saved</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-4 shadow-sm shadow-slate-900/5 lg:p-6">
          <div
            ref={previewRef}
            className="mx-auto max-w-[794px] rounded-sm border border-slate-200 bg-white p-7 shadow-md shadow-slate-300/50"
          >
            <header className="border-b border-slate-200 pb-5 text-center">
              <h2 className="text-3xl font-black uppercase tracking-wide text-slate-950">
                {resumeBuilderData.fullName || userProfile.name}
              </h2>
              <p className="mt-2 text-base font-bold text-cyan-700">
                {resumeBuilderData.role || userProfile.role}
              </p>
              <p className="mt-3 text-sm font-medium text-slate-500">
                {resumeBuilderData.contactEmail || userProfile.email}
                {resumeBuilderData.phone ? ` | ${resumeBuilderData.phone}` : ""}
                {(resumeBuilderData.location || userProfile.location)
                  ? ` | ${resumeBuilderData.location || userProfile.location}`
                  : ""}
              </p>
              {(resumeBuilderData.portfolio || resumeBuilderData.github) && (
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {[resumeBuilderData.portfolio, resumeBuilderData.github]
                    .filter(Boolean)
                    .join(" | ")}
                </p>
              )}
            </header>

            <div className="mt-5 space-y-5">
              {resumeBuilderData.summary.trim() && (
                <section data-resume-section>
                  <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                    Professional Summary
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {resumeBuilderData.summary}
                  </p>
                </section>
              )}

              {(resumeBuilderData.skills.trim() ||
                resumeBuilderData.softSkills.trim()) && (
                <section data-resume-section>
                  <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                    Skills
                  </h3>
                  {resumeBuilderData.skills.trim() && (
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      <span className="font-bold">Technical skills:</span>{" "}
                      {resumeBuilderData.skills}
                    </p>
                  )}
                  {resumeBuilderData.softSkills.trim() && (
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      <span className="font-bold">Soft skills:</span>{" "}
                      {resumeBuilderData.softSkills}
                    </p>
                  )}
                </section>
              )}

              {resumeBuilderData.experience.length > 0 && (
                <section data-resume-section>
                  <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                    Experience
                  </h3>
                  <div className="mt-3 space-y-4">
                    {resumeBuilderData.experience.map((item, index) => (
                      <div key={`${item.role}-${item.company}-${index}`}>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div>
                            {item.role && (
                              <p className="font-black text-slate-950">
                                {item.role}
                              </p>
                            )}
                            {item.company && (
                              <p className="text-sm font-bold text-slate-600">
                                {item.company}
                              </p>
                            )}
                          </div>
                          {(item.period || item.location) && (
                            <p className="shrink-0 text-sm font-bold text-slate-500">
                              {[item.period, item.location]
                                .filter(Boolean)
                                .join(" | ")}
                            </p>
                          )}
                        </div>
                        {item.detail && (
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                            {item.detail}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {resumeBuilderData.projects.length > 0 && (
                <section data-resume-section>
                  <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                    Projects
                  </h3>
                  <ul className="mt-2 list-disc space-y-3 pl-5">
                    {resumeBuilderData.projects.map((project, index) => (
                      <li
                        key={`${project}-${index}`}
                        className="whitespace-pre-line text-sm leading-6 text-slate-700"
                      >
                        {project}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {resumeBuilderData.education.length > 0 && (
                <section data-resume-section>
                  <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                    Education
                  </h3>
                  <div className="mt-3 space-y-4">
                    {resumeBuilderData.education.map((item, index) => (
                      <div
                        key={`${item.school}-${item.degree}-${index}`}
                        className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                      >
                        <div>
                          {item.school && (
                            <p className="font-black text-slate-950">
                              {item.school}
                            </p>
                          )}
                          {item.degree && (
                            <p className="mt-0.5 text-sm font-semibold text-slate-600">
                              {item.degree}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 text-left sm:text-right">
                          {(item.started || item.graduation) && (
                            <p className="text-sm font-bold text-slate-500">
                              {[item.started, item.graduation]
                                .filter(Boolean)
                                .join(" – ")}
                            </p>
                          )}
                          {item.gpa && (
                            <p className="mt-0.5 text-xs font-semibold text-slate-500">
                              {item.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {resumeBuilderData.certifications.length > 0 && (
                <section data-resume-section>
                  <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                    Certifications
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                    {resumeBuilderData.certifications.map(
                      (certification, index) => (
                        <li key={`${certification}-${index}`}>
                          {certification}
                        </li>
                      ),
                    )}
                  </ul>
                </section>
              )}

              {resumeBuilderData.awards.length > 0 && (
                <section data-resume-section>
                  <h3 className="border-b border-slate-200 pb-1 text-sm font-black uppercase tracking-wide text-slate-950">
                    Awards / Achievements
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                    {resumeBuilderData.awards.map((award, index) => (
                      <li key={`${award}-${index}`}>{award}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
