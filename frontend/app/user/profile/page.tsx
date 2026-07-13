"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
  UserProfile,
} from "../../../lib/user-api";

const emptyProfile: UserProfile = {
  id: "",
  name: "",
  email: "",
  role: "",
  location: "",
  joined: "",
  resumeScore: 0,
  skills: "",
};

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const initials = useMemo(
    () =>
      profile.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "US",
    [profile.name],
  );

  useEffect(() => {
    getUserProfile().then((data) => setProfile(data.profile));
  }, []);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");
    const formData = new FormData(event.currentTarget);

    try {
      const data = await updateUserProfile({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        role: String(formData.get("role") || ""),
        location: String(formData.get("location") || ""),
        skills: String(formData.get("skills") || ""),
      });
      setProfile(data.profile);
      localStorage.setItem("jobmatchUser", JSON.stringify(data.profile));
      setProfileMessage("Profile saved successfully");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Profile update failed");
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    const formData = new FormData(event.currentTarget);

    try {
      const data = await updateUserPassword({
        oldPassword: String(formData.get("oldPassword") || ""),
        newPassword: String(formData.get("newPassword") || ""),
        confirmNewPassword: String(formData.get("confirmNewPassword") || ""),
      });
      event.currentTarget.reset();
      setPasswordMessage(data.message || "Password updated successfully");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Password update failed");
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
                  {profile.name}
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="w-fit rounded-2xl border border-cyan-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Joined
              </p>
              <p className="mt-1 text-sm font-black text-cyan-700">
                {profile.joined || "New account"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="grid gap-5 border-t border-slate-100 p-6 sm:p-8 md:grid-cols-2">
          <h2 className="text-xl font-black text-slate-950 md:col-span-2">
            Profile Details
          </h2>
          <label className="text-sm font-bold text-slate-800">
            Full name
            <input name="name" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" defaultValue={profile.name} required />
          </label>
          <label className="text-sm font-bold text-slate-800">
            Email
            <input name="email" type="email" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" defaultValue={profile.email} required />
          </label>
          <label className="text-sm font-bold text-slate-800">
            Target role
            <input name="role" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" defaultValue={profile.role} />
          </label>
          <label className="text-sm font-bold text-slate-800">
            Location
            <input name="location" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" defaultValue={profile.location} />
          </label>
          <label className="text-sm font-bold text-slate-800 md:col-span-2">
            Skills
            <input name="skills" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" defaultValue={profile.skills} />
          </label>
          {(profileError || profileMessage) && (
            <p className={`rounded-xl px-4 py-3 text-sm font-bold md:col-span-2 ${profileError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {profileError || profileMessage}
            </p>
          )}
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
              Save Profile
            </button>
          </div>

        </form>

        <form onSubmit={handlePasswordSubmit} className="grid gap-5 border-t border-slate-100 p-6 sm:p-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className="text-xl font-black text-slate-950">Change Password</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Use a strong password that you do not use for other accounts.
            </p>
          </div>
          <label className="text-sm font-bold text-slate-800 md:col-span-2">
            Current password
            <input name="oldPassword" type="password" autoComplete="current-password" placeholder="Enter your current password" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" required />
          </label>
          <label className="text-sm font-bold text-slate-800">
            New password
            <input name="newPassword" type="password" autoComplete="new-password" placeholder="Enter a new password" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" required minLength={6} />
          </label>
          <label className="text-sm font-bold text-slate-800">
            Confirm new password
            <input name="confirmNewPassword" type="password" autoComplete="new-password" placeholder="Confirm your new password" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" required minLength={6} />
          </label>
          {(passwordError || passwordMessage) && (
            <p className={`rounded-xl px-4 py-3 text-sm font-bold md:col-span-2 ${passwordError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {passwordError || passwordMessage}
            </p>
          )}
          <div className="md:col-span-2">
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
