"use client";

import { useEffect, useState } from "react";
import { AdminUser, getAdminUsers } from "../../../lib/admin-api";

type User = AdminUser;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

function scoreBadgeColor(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 70) return "bg-blue-100 text-blue-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function statusStyles(status: string) {
  if (status === "In Review") {
    return {
      logo: "bg-blue-50 text-blue-600",
      badge: "bg-blue-50 text-blue-700",
      text: "text-blue-600",
    };
  }

  if (status === "Accepted") {
    return {
      logo: "bg-emerald-50 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700",
      text: "text-emerald-600",
    };
  }

  if (status === "Rejected") {
    return {
      logo: "bg-rose-50 text-rose-600",
      badge: "bg-rose-50 text-rose-600",
      text: "text-red-600",
    };
  }

  return {
    logo: "bg-amber-50 text-amber-600",
    badge: "bg-amber-50 text-amber-700",
    text: "text-amber-700",
  };
}

function DetailIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="grid h-5 w-5 place-items-center text-slate-400">
      {children}
    </span>
  );
}

function UserDetailModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const applications = user.applications ?? [];
  const resume = user.resume;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 py-4 backdrop-blur-md">
      <button
        aria-label="Close user details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-lg font-black text-white ${user.avatarColor}`}
            >
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-black text-slate-950">
                {user.name}
              </h2>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-500">
                {user.role}
              </p>
            </div>
          </div>
          <button
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
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

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="grid gap-3 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-3">
                <DetailIcon>
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
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                </DetailIcon>
                {user.email}
              </div>
              <div className="flex items-center gap-3">
                <DetailIcon>
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
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </DetailIcon>
                {user.location}
              </div>
              <div className="flex items-center gap-3">
                <DetailIcon>
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </DetailIcon>
                Joined {user.joined}
              </div>
            </div>
          </div>

          {user.skills && (
            <div>
              <h3 className="text-base font-black text-slate-950">
                Profile Skills
              </h3>
              <div className="mt-3 flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-4">
                {user.skills
                  .split(/[,;\n]/)
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-black text-cyan-700"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-base font-black text-slate-950">
              Application Overview
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-blue-50 p-4 text-center">
                <p className="text-3xl font-black text-blue-600">
                  {user.applied}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Applied
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                <p className="text-3xl font-black text-emerald-600">
                  {user.accepted}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Accepted
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4 text-center">
                <p className="text-3xl font-black text-red-600">
                  {user.rejected}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Rejected
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-black text-slate-950">
              Resume Information
            </h3>
            <div className="mt-3 rounded-2xl bg-slate-50 p-4">
              {resume ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-slate-400">
                      <span
                        className={`text-3xl font-black ${scoreColor(user.resumeScore)}`}
                      >
                        {user.resumeScore}
                      </span>{" "}
                      <span className="text-base font-medium">/100</span>
                    </p>
                    <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${scoreBadgeColor(user.resumeScore)}`}>
                      {user.resumeLabel}
                    </span>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
                    <div
                      className={`h-full rounded-full ${scoreBarColor(user.resumeScore)}`}
                      style={{ width: `${user.resumeScore}%` }}
                    />
                  </div>
                  <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-black uppercase text-slate-400">Target Role</p>
                      <p className="mt-1 font-bold text-slate-800">{resume.role}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-400">Resume Status</p>
                      <p className="mt-1 font-bold text-slate-800">{resume.status}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-400">Last Updated</p>
                      <p className="mt-1 font-bold text-slate-800">{resume.updated}</p>
                    </div>
                  </div>
                  {resume.summary && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <p className="text-xs font-black uppercase text-slate-400">Summary</p>
                      <p className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-slate-700">
                        {resume.summary}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm font-semibold text-slate-500">
                  This user has not saved a resume yet.
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-black text-slate-950">
              Applications
            </h3>
            <div className="mt-3 grid gap-2.5">
              {applications.map((application) => {
                const styles = statusStyles(application.status);

                return (
                  <div
                    key={application.id}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-black ${styles.logo}`}
                      >
                        {initials(application.company)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-slate-950">
                          {application.job}
                        </p>
                        <p className={`mt-0.5 text-sm font-medium ${styles.text}`}>
                          {application.company} - {application.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${styles.badge}`}
                    >
                      {application.status}
                    </span>
                  </div>
                );
              })}
              {applications.length === 0 && (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                  This user has not submitted any applications yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    getAdminUsers().then((data) => {
      setUsers(data.users);
    });
  }, []);

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
            placeholder="Search by name or role..."
          />
        </div>

        <div className="inline-flex h-16 items-center justify-center gap-3 rounded-3xl border border-blue-100 bg-blue-50 px-7 text-blue-600">
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-xl font-black">{users.length}</span>
          <span className="text-base font-medium">Total Users</span>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left">
            <thead className="bg-slate-50 text-sm font-bold text-slate-500">
              <tr>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Role / Location</th>
                <th className="px-8 py-5 text-center">Applied</th>
                <th className="px-8 py-5 text-center">Accepted</th>
                <th className="px-8 py-5">Score</th>
                <th className="px-8 py-5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-cyan-50/35"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-black text-white ${user.avatarColor}`}
                      >
                        {initials(user.name)}
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-950">
                          {user.name}
                        </p>
                        <p className="mt-1 text-base font-medium text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <p className="text-base font-bold text-slate-800">
                      {user.role}
                    </p>
                    <p className="mt-1 text-base font-medium text-slate-400">
                      {user.location}
                    </p>
                  </td>

                  <td className="px-8 py-6 text-center text-lg font-black text-blue-600">
                    {user.applied}
                  </td>

                  <td className="px-8 py-6 text-center text-lg font-black text-emerald-600">
                    {user.accepted}
                  </td>

                  <td className="px-8 py-6">
                    <div className="w-28">
                      <p className="text-base font-medium text-slate-400">
                        <span className={`font-black ${scoreColor(user.resumeScore)}`}>
                          {user.resumeScore}
                        </span>{" "}
                        /100
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${scoreBarColor(user.resumeScore)}`}
                          style={{ width: `${user.resumeScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <button
                      aria-label={`View ${user.name}`}
                      className="inline-grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-700"
                      onClick={() => setSelectedUser(user)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
