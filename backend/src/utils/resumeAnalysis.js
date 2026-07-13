const ACTION_VERBS = [
  "achieved", "built", "created", "delivered", "designed", "developed",
  "improved", "increased", "launched", "led", "managed", "optimized",
  "reduced", "resolved", "implemented", "automated", "collaborated",
];

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function wordCount(value) {
  return text(value).split(/\s+/).filter(Boolean).length;
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function experiences(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function hasActionVerb(value) {
  const normalized = text(value).toLowerCase();
  return ACTION_VERBS.some((verb) => new RegExp(`\\b${verb}\\b`).test(normalized));
}

function hasMetric(value) {
  return /\b\d+(?:[.,]\d+)?\s*(?:%|x|k|m|hours?|days?|weeks?|months?|users?|clients?|projects?|members?)?\b/i.test(text(value));
}

function labelFor(score) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Needs improvement";
}

function tipTitle(message) {
  if (message.includes("phone")) return "Complete contact details";
  if (message.includes("summary")) return "Improve your summary";
  if (message.includes("technical skills")) return "Expand your skills";
  if (message.includes("experience bullets")) return "Show measurable impact";
  if (message.includes("work, internship")) return "Add relevant experience";
  if (message.includes("degree, institution")) return "Complete education details";
  if (message.includes("education or training")) return "Add education";
  if (message.includes("project technologies")) return "Strengthen your projects";
  if (message.includes("relevant project")) return "Add a relevant project";
  if (message.includes("role-specific keywords")) return "Improve ATS keywords";
  return "Resume improvement";
}

export function automaticReviewStatus(score) {
  return score >= 70 ? "Reviewed" : "Needs Revision";
}

export function analyzeResume(resume = {}) {
  const summary = text(resume.summary);
  const skills = text(resume.skills)
    .split(/[,;\n]/)
    .map((value) => value.trim())
    .filter(Boolean);
  const softSkills = text(resume.softSkills)
    .split(/[,;\n]/)
    .map((value) => value.trim())
    .filter(Boolean);
  const experience = experiences(resume.experience);
  const education = list(resume.educationEntries).length
    ? list(resume.educationEntries)
    : text(resume.education)
      ? [{ degree: resume.education }]
      : [];
  const projects = list(resume.projects).map(text).filter(Boolean);
  const certifications = list(resume.certifications).map(text).filter(Boolean);
  const awards = list(resume.awards).map(text).filter(Boolean);
  const experienceDetails = experience.map((item) => text(item?.detail)).join(" ");
  const role = text(resume.role);

  const sections = {
    contact: 0,
    summary: 0,
    skills: 0,
    experience: 0,
    education: 0,
    projects: 0,
    credentials: 0,
    atsReadiness: 0,
  };
  const strengths = [];
  const improvements = [];

  sections.contact += text(resume.email || resume.contactEmail) ? 3 : 0;
  sections.contact += text(resume.phone) ? 3 : 0;
  sections.contact += text(resume.location) ? 2 : 0;
  sections.contact += text(resume.portfolio) || text(resume.github) ? 2 : 0;
  sections.contact += role && role !== "Not specified" ? 2 : 0;
  if (sections.contact >= 10) strengths.push("Contact details and target role are complete.");
  else improvements.push("Complete your phone, location, target role, and a professional profile link.");

  if (summary) {
    sections.summary += 4;
    const length = wordCount(summary);
    sections.summary += length >= 40 && length <= 120 ? 6 : length >= 20 ? 3 : 0;
    sections.summary += hasActionVerb(summary) ? 2 : 0;
    sections.summary += hasMetric(summary) ? 3 : 0;
    if (sections.summary >= 10) strengths.push("Professional summary clearly communicates relevant value.");
    else improvements.push("Make the summary 40-120 words and include a specific, measurable achievement.");
  } else {
    improvements.push("Add a concise professional summary tailored to your target role.");
  }

  sections.skills += Math.min(skills.length, 6) * 1.5;
  sections.skills += skills.length >= 8 ? 3 : 0;
  sections.skills += softSkills.length >= 2 ? 3 : softSkills.length ? 1.5 : 0;
  sections.skills = Math.round(Math.min(sections.skills, 15));
  if (sections.skills >= 11) strengths.push("Skills section has a useful mix of technical and interpersonal skills.");
  else improvements.push("List at least 6-8 specific technical skills plus 2 relevant soft skills.");

  if (experience.length) {
    sections.experience += 5;
    const completeEntries = experience.filter(
      (item) => text(item?.role) && text(item?.company) && text(item?.period),
    ).length;
    sections.experience += Math.min(completeEntries * 4, 8);
    sections.experience += wordCount(experienceDetails) >= 30 ? 4 : wordCount(experienceDetails) >= 12 ? 2 : 0;
    sections.experience += hasActionVerb(experienceDetails) ? 4 : 0;
    sections.experience += hasMetric(experienceDetails) ? 4 : 0;
    if (sections.experience >= 18) strengths.push("Experience uses complete entries and evidence of impact.");
    else improvements.push("Strengthen experience bullets with action verbs and measurable results such as percentages or counts.");
  } else {
    improvements.push("Add relevant work, internship, freelance, or volunteer experience.");
  }

  if (education.length) {
    sections.education += 5;
    const detailed = education.some(
      (item) => text(item?.degree) && text(item?.school) && (text(item?.graduation) || text(item?.started)),
    );
    sections.education += detailed ? 7 : 3;
    if (detailed) strengths.push("Education includes institution, qualification, and dates.");
    else improvements.push("Complete the degree, institution, and study dates in education.");
  } else {
    improvements.push("Add your most relevant education or training.");
  }

  if (projects.length) {
    sections.projects += 4;
    sections.projects += projects.some((project) => wordCount(project) >= 20) ? 3 : 1;
    sections.projects += projects.some((project) => hasActionVerb(project) || hasMetric(project)) ? 3 : 0;
    if (sections.projects >= 8) strengths.push("Projects provide meaningful evidence of practical work.");
    else improvements.push("Describe project technologies, your contribution, and the outcome.");
  } else {
    improvements.push("Add a relevant project with technologies, contribution, and outcome.");
  }

  sections.credentials = Math.min(certifications.length * 2 + awards.length * 2, 5);
  if (sections.credentials >= 2) strengths.push("Certifications or awards add supporting evidence.");

  const totalWords = wordCount([summary, experienceDetails, ...projects].join(" "));
  sections.atsReadiness += totalWords >= 100 ? 3 : totalWords >= 50 ? 2 : totalWords >= 20 ? 1 : 0;
  sections.atsReadiness += skills.length >= 5 ? 2 : 0;
  sections.atsReadiness += role && role !== "Not specified" ? 1 : 0;
  if (sections.atsReadiness < 4) improvements.push("Add more role-specific keywords and substantive content for ATS parsing.");

  const score = Math.max(0, Math.min(100, Math.round(Object.values(sections).reduce((sum, value) => sum + value, 0))));

  const limitedImprovements = improvements.slice(0, 5);
  const recommendations = limitedImprovements.map((message) => ({
    title: tipTitle(message),
    message,
  }));

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Tailor each application",
      message: "Your resume is already strong. For each application, align the summary and skills with the job description, while keeping every claim accurate and supported by evidence.",
    });
  }

  return {
    version: 1,
    score,
    label: labelFor(score),
    summary: `${labelFor(score)} resume (${score}/100), based on content quality, completeness, impact, and ATS readiness.`,
    breakdown: sections,
    strengths: strengths.slice(0, 4),
    improvements: limitedImprovements,
    recommendations,
  };
}
