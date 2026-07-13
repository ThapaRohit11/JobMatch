import { authorizedRequest } from "./api";

export type AdminJob = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  skills?: string;
  type: string;
  applyBy?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  applicants: number;
  posted: string;
  status: "Open" | "Closed";
};

export type AdminCompany = {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  jobs: number;
};

export type AdminApplication = {
  id: string;
  applicant: string;
  email: string;
  job: string;
  company: string;
  location: string;
  date: string;
  status: "Pending" | "In Review" | "Accepted" | "Rejected";
};

export type AdminResume = {
  id: string;
  candidate: string;
  email: string;
  uploaded: string;
  updated: string;
  score: string;
  role: string;
  status: "Reviewed" | "Needs Revision" | "Pending";
  revisionNotes?: string;
  contactEmail?: string;
  phone?: string;
  location?: string;
  portfolio?: string;
  github?: string;
  summary?: string;
  skills?: string;
  softSkills?: string;
  projects?: string[];
  experience?: Array<{
    role: string;
    company: string;
    period: string;
    location: string;
    detail: string;
  }>;
  education?: string;
  educationEntries?: Array<{
    degree?: string;
    school?: string;
    started?: string;
    graduation?: string;
    gpa?: string;
  }>;
  certifications?: string[];
  awards?: string[];
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  location: string;
  role: string;
  skills: string;
  applied: number;
  accepted: number;
  rejected: number;
  resumeScore: number;
  avatarColor: string;
  status: string;
  joined: string;
  applications: AdminApplication[];
  resume: AdminResume | null;
};

export function getAdminDashboard() {
  return authorizedRequest("/api/admin/dashboard");
}

export function getAdminJobs() {
  return authorizedRequest("/api/admin/jobs");
}

export function createAdminJob(payload: Partial<AdminJob>) {
  return authorizedRequest("/api/admin/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminJob(id: string, payload: Partial<AdminJob>) {
  return authorizedRequest(`/api/admin/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminJob(id: string) {
  return authorizedRequest(`/api/admin/jobs/${id}`, { method: "DELETE" });
}

export function getAdminCompanies() {
  return authorizedRequest("/api/admin/companies");
}

export function createAdminCompany(payload: Partial<AdminCompany>) {
  return authorizedRequest("/api/admin/companies", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminCompany(id: string, payload: Partial<AdminCompany>) {
  return authorizedRequest(`/api/admin/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminCompany(id: string) {
  return authorizedRequest(`/api/admin/companies/${id}`, { method: "DELETE" });
}

export function getAdminApplications() {
  return authorizedRequest("/api/admin/applications");
}

export function updateAdminApplication(id: string, status: AdminApplication["status"]) {
  return authorizedRequest(`/api/admin/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function getAdminResumes() {
  return authorizedRequest("/api/admin/resumes");
}

export function updateAdminResume(
  id: string,
  payload: Pick<AdminResume, "status"> & { revisionNotes?: string },
) {
  return authorizedRequest(`/api/admin/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getAdminUsers() {
  return authorizedRequest("/api/admin/users");
}
