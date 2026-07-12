"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { authorizedRequest } from "../../../lib/api";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<StoredUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const initials = useMemo(() => {
    if (!name.trim()) {
      return "AD";
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [name]);

  useEffect(() => {
    authorizedRequest("/api/auth/me")
      .then((data) => {
        setAdmin(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
        localStorage.setItem("jobmatchUser", JSON.stringify(data.user));
      })
      .catch(() => {
        setProfileError("Please login again to edit admin profile");
      });
  }, []);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    if (!name.trim() || !email.trim()) {
      setProfileError("Admin name and email cannot be empty");
      return;
    }

    setIsSavingProfile(true);

    try {
      const data = await authorizedRequest("/api/auth/admin/profile", {
        method: "PUT",
        body: JSON.stringify({
          name,
          email,
        }),
      });

      setAdmin(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      localStorage.setItem("jobmatchToken", data.token);
      localStorage.setItem("jobmatchUser", JSON.stringify(data.user));
      setProfileMessage("Profile updated successfully");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Profile update failed");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsSavingPassword(true);

    try {
      const data = await authorizedRequest("/api/auth/admin/password", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordMessage(data.message || "Password updated successfully");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Password update failed");
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="bg-gradient-to-r from-cyan-50 via-white to-indigo-50 px-6 py-7 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-2xl font-black text-white shadow-xl shadow-cyan-500/20">
                {initials}
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  {admin?.name || "Admin User"}
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {admin?.email || "admin@jobmatch.com"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
            <form className="contents" onSubmit={handleProfileSubmit}>
              <h2 className="text-xl font-black text-slate-950 md:col-span-2">
                Account Details
              </h2>
              <label className="text-sm font-bold text-slate-800">
                Admin name
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
              <label className="text-sm font-bold text-slate-800">
                Email
                <input
                  type="email"
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              {(profileError || profileMessage) && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm font-bold md:col-span-2 ${
                    profileError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {profileError || profileMessage}
                </p>
              )}
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button
                  disabled={isSavingProfile}
                  className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
                >
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>

            <form className="contents" onSubmit={handlePasswordSubmit}>
              <div className="mt-2 border-t border-slate-100 pt-5 md:col-span-2">
                <h2 className="text-xl font-black text-slate-950">Security</h2>
              </div>
              <label className="text-sm font-bold text-slate-800 md:col-span-2">
                Old password
                <input
                  type="password"
                  autoComplete="current-password"
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                  required
                />
              </label>
              <label className="text-sm font-bold text-slate-800">
                New password
                <input
                  type="password"
                  autoComplete="new-password"
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  minLength={6}
                />
              </label>
              <label className="text-sm font-bold text-slate-800">
                Confirm password
                <input
                  type="password"
                  autoComplete="new-password"
                  className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  placeholder="Confirm password"
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                  required
                  minLength={6}
                />
              </label>
              {(passwordError || passwordMessage) && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm font-bold md:col-span-2 ${
                    passwordError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {passwordError || passwordMessage}
                </p>
              )}
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button
                  disabled={isSavingPassword}
                  className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
                >
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
