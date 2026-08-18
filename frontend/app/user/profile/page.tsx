"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  getUserProfile,
  updateUserAvatar,
  updateUserPassword,
  updateUserProfile,
  UserProfile,
} from "../../../lib/user-api";
import { findCareerRoles } from "../../../lib/career-roles";
import { findSkills } from "../../../lib/skills";

const MAX_AVATAR_SOURCE_BYTES = 8 * 1024 * 1024;

function splitSkills(value: string) {
  return value
    .split(/[,;\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function resizeImageToDataUrl(file: File, maxDimension = 512, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read the selected file"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Unable to read the selected image"));
      image.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Unable to process the image"));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const emptyProfile: UserProfile = {
  id: "",
  name: "",
  email: "",
  role: "",
  location: "",
  joined: "",
    resumeScore: 0,
    resumeLabel: "No resume",
  skills: "",
};

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const [activeRoleIndex, setActiveRoleIndex] = useState(-1);
  const [avatarError, setAvatarError] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [activeSkillIndex, setActiveSkillIndex] = useState(-1);

  const skillSuggestions = useMemo(
    () =>
      findSkills(skillInput, 20).filter(
        (skill) => !skills.some((added) => added.toLowerCase() === skill.toLowerCase()),
      ),
    [skillInput, skills],
  );

  const roleSuggestions = useMemo(() => findCareerRoles(roleQuery), [roleQuery]);

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
    getUserProfile()
      .then((data) => {
        setProfile(data.profile);
        setRoleQuery(data.profile.role || "");
        setSkills(splitSkills(data.profile.skills || ""));
      })
      .catch((error) =>
        setProfileError(error instanceof Error ? error.message : "Unable to load profile"),
      );
  }, []);

  function addSkill(rawValue: string) {
    const value = rawValue.trim();
    if (!value) return;

    setSkills((current) =>
      current.some((skill) => skill.toLowerCase() === value.toLowerCase())
        ? current
        : [...current, value],
    );
    setSkillInput("");
    setShowSkillSuggestions(false);
    setActiveSkillIndex(-1);
  }

  function removeSkill(index: number) {
    setSkills((current) => current.filter((_, i) => i !== index));
  }

  function selectRole(role: string) {
    setRoleQuery(role);
    setShowRoleSuggestions(false);
    setActiveRoleIndex(-1);
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file");
      return;
    }

    if (file.size > MAX_AVATAR_SOURCE_BYTES) {
      setAvatarError("Image must be smaller than 8MB");
      return;
    }

    setAvatarError("");
    setIsUploadingAvatar(true);

    try {
      const resized = await resizeImageToDataUrl(file);
      const data = await updateUserAvatar(resized);
      setProfile(data.profile);
      localStorage.setItem("jobmatchUser", JSON.stringify(data.profile));
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : "Unable to update photo");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

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
              <div className="relative shrink-0">
                <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-2xl font-black text-white shadow-xl shadow-cyan-500/20">
                  {profile.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar} alt="Profile photo" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Change profile photo"
                  disabled={isUploadingAvatar}
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-cyan-600 text-white shadow-md transition hover:bg-cyan-700 disabled:opacity-60"
                >
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.2 3H8.8L7 6H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-3l-1.8-3Z" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  {profile.name}
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {profile.email}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
                  {isUploadingAvatar && <span className="text-slate-500">Uploading photo...</span>}
                  {avatarError && <span className="text-red-600">{avatarError}</span>}
                </div>
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
          <div className="relative text-sm font-bold text-slate-800">
            <label htmlFor="target-role">Professional title</label>
            <input
              id="target-role"
              name="role"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="role-suggestions"
              aria-expanded={showRoleSuggestions}
              aria-activedescendant={activeRoleIndex >= 0 ? `role-option-${activeRoleIndex}` : undefined}
              autoComplete="off"
              placeholder="Start typing, e.g. Software..."
              value={roleQuery}
              onChange={(event) => {
                setRoleQuery(event.target.value);
                setShowRoleSuggestions(true);
                setActiveRoleIndex(-1);
              }}
              onFocus={() => setShowRoleSuggestions(true)}
              onBlur={() => setShowRoleSuggestions(false)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setShowRoleSuggestions(true);
                  setActiveRoleIndex((current) => Math.min(current + 1, roleSuggestions.length - 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveRoleIndex((current) => Math.max(current - 1, 0));
                } else if (event.key === "Enter" && activeRoleIndex >= 0) {
                  event.preventDefault();
                  selectRole(roleSuggestions[activeRoleIndex]);
                } else if (event.key === "Escape") {
                  setShowRoleSuggestions(false);
                  setActiveRoleIndex(-1);
                }
              }}
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
            <p className="mt-2 text-xs font-medium text-slate-500">
              Choose a specific title to receive more relevant job matches.
            </p>
            {showRoleSuggestions && roleSuggestions.length > 0 && (
              <div
                id="role-suggestions"
                role="listbox"
                className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
              >
                {roleSuggestions.map((role, index) => (
                  <button
                    id={`role-option-${index}`}
                    key={role}
                    type="button"
                    role="option"
                    aria-selected={index === activeRoleIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectRole(role)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${index === activeRoleIndex ? "bg-cyan-50 text-cyan-800" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <span>{role}</span>
                    <span className="text-xs font-semibold text-slate-400">Select</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <label className="text-sm font-bold text-slate-800">
            Location
            <input name="location" className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" defaultValue={profile.location} />
          </label>
          <div className="relative text-sm font-bold text-slate-800 md:col-span-2">
            <label htmlFor="skill-input">Skills</label>
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50/40 p-2.5 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-cyan-800 shadow-sm"
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() => removeSkill(index)}
                    className="grid h-4 w-4 place-items-center rounded-full text-cyan-500 transition hover:bg-cyan-100 hover:text-cyan-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="skill-input"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="skill-suggestions"
                aria-expanded={showSkillSuggestions}
                aria-activedescendant={activeSkillIndex >= 0 ? `skill-option-${activeSkillIndex}` : undefined}
                autoComplete="off"
                value={skillInput}
                onChange={(event) => {
                  setSkillInput(event.target.value);
                  setShowSkillSuggestions(true);
                  setActiveSkillIndex(-1);
                }}
                onFocus={() => setShowSkillSuggestions(true)}
                onBlur={() => setShowSkillSuggestions(false)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setShowSkillSuggestions(true);
                    setActiveSkillIndex((current) => Math.min(current + 1, skillSuggestions.length - 1));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveSkillIndex((current) => Math.max(current - 1, 0));
                  } else if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addSkill(activeSkillIndex >= 0 ? skillSuggestions[activeSkillIndex] : skillInput);
                  } else if (event.key === "Escape") {
                    setShowSkillSuggestions(false);
                    setActiveSkillIndex(-1);
                  } else if (event.key === "Backspace" && !skillInput && skills.length) {
                    event.preventDefault();
                    removeSkill(skills.length - 1);
                  }
                }}
                placeholder={skills.length ? "Add another skill..." : "Type a skill and press Enter"}
                className="h-8 min-w-[160px] flex-1 border-none bg-transparent px-1 text-sm font-medium text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Press Enter to add, or pick a suggestion below.
              </p>
              <button
                type="button"
                onClick={() => addSkill(skillInput)}
                className="text-xs font-bold text-cyan-700 hover:underline"
              >
                + Add skill
              </button>
            </div>
            {showSkillSuggestions && skillSuggestions.length > 0 && (
              <div
                id="skill-suggestions"
                role="listbox"
                className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
              >
                {skillSuggestions.map((skill, index) => (
                  <button
                    id={`skill-option-${index}`}
                    key={skill}
                    type="button"
                    role="option"
                    aria-selected={index === activeSkillIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => addSkill(skill)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${index === activeSkillIndex ? "bg-cyan-50 text-cyan-800" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <span>{skill}</span>
                    <span className="text-xs font-semibold text-slate-400">Add</span>
                  </button>
                ))}
              </div>
            )}
            <input type="hidden" name="skills" value={skills.join(", ")} />
          </div>
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
