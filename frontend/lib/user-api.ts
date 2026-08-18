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
  avatar?: string;
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
  saved?: boolean;
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

export function getSavedUserJobs() {
  return authorizedRequest("/api/user/saved-jobs");
}

export function setUserJobSaved(id: string, saved: boolean) {
  return authorizedRequest(`/api/user/jobs/${id}/save`, {
    method: "PUT",
    body: JSON.stringify({ saved }),
  });
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

export function updateUserAvatar(avatar: string) {
  return authorizedRequest("/api/user/profile/avatar", {
    method: "PUT",
    body: JSON.stringify({ avatar }),
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

export function getAIResumeInsights() {
  return authorizedRequest("/api/user/resume/ai-insights");
}

export function saveUserResume(payload: Record<string, unknown>) {
  return authorizedRequest("/api/user/resume", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export function sendChatMessage(messages: ChatMessage[]) {
  return authorizedRequest("/api/user/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
}
