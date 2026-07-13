import { authorizedRequest } from "./api";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  joined: string;
  resumeScore: number;
  resumeLabel: string;
  skills: string;
};

export type UserJob = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  skills: string;
  match: number;
  type: string;
  posted: string;
  status: "Open" | "Closed";
  description?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  applyBy?: string;
};

export type UserApplication = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  applied: string;
  status: "Pending" | "In Review" | "Accepted" | "Rejected";
  jobDetails?: UserJob | null;
};

export function getUserDashboard() {
  return authorizedRequest("/api/user/dashboard");
}

export function getUserJobs() {
  return authorizedRequest("/api/user/jobs");
}

export function applyToUserJob(id: string) {
  return authorizedRequest(`/api/user/jobs/${id}/apply`, { method: "POST" });
}

export function getUserApplications() {
  return authorizedRequest("/api/user/applications");
}

export function getUserProfile() {
  return authorizedRequest("/api/user/profile");
}

export function updateUserProfile(payload: Partial<UserProfile>) {
  return authorizedRequest("/api/user/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateUserPassword(payload: {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  return authorizedRequest("/api/user/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getUserResume() {
  return authorizedRequest("/api/user/resume");
}

export function saveUserResume(payload: Record<string, unknown>) {
  return authorizedRequest("/api/user/resume", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
