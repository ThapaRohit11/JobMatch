"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUserProfile, UserProfile } from "../../lib/user-api";

const links = [
  { href: "/user", label: "Dashboard", icon: "⌂" },
  { href: "/user/resume/analyzer", label: "Resume Analyzer", icon: "◌" },
  { href: "/user/resume", label: "Resume Builder", icon: "✦" },
  { href: "/user/jobs", label: "Job Matches", icon: "⌕" },
  { href: "/user/saved-jobs", label: "Saved Jobs", icon: "♡" },
  { href: "/user/applications", label: "Applications", icon: "▤" },
  { href: "/user/profile", label: "Profile", icon: "◎" },
];

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const initials = useMemo(
    () =>
      profile?.name
        ?.split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "US",
    [profile],
  );

  useEffect(() => {
    getUserProfile()
      .then((data) => setProfile(data.profile))
      .catch(() => setProfile(null));
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] border-r border-slate-200/80 bg-white px-4 py-5 lg:flex lg:flex-col">
        <Link
          href="/user"
          className="rounded-2xl p-3"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-sm font-black text-white shadow-lg shadow-slate-900/15">
              JM
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">
                JobMatch <span className="text-indigo-600">AI</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Career workspace
              </span>
            </span>
          </span>
        </Link>

        <nav className="mt-7 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className={`grid h-7 w-7 place-items-center rounded-lg text-sm ${isActive ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}>{link.icon}</span>
                {link.label}
                <span
                  className={`ml-auto h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-indigo-600" : "bg-transparent"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
        >
          Logout
        </button>
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[72px] items-center justify-between gap-4 px-6 lg:px-9">
            <Link href="/user" className="text-lg font-black lg:hidden">
              JobMatch
            </Link>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-xs font-black text-white">
                {initials}
              </div>
              <div className="hidden text-sm sm:block">
                <p className="font-bold">{profile?.name || ""}</p>
                <p className="text-xs text-slate-500">{profile?.email || ""}</p>
              </div>
              </div>
            </div>
          </div>
        </header>

        <div className="block border-b border-cyan-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${
                    isActive
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-cyan-100 text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <section className="mx-auto max-w-[1600px] px-5 py-7 lg:px-9 lg:py-9">{children}</section>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
          <button
            type="button"
            aria-label="Cancel logout"
            className="absolute inset-0 cursor-default"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="relative z-10 w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-900/20"
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-600">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </div>
            <h2
              id="logout-title"
              className="mt-5 text-2xl font-black text-slate-950"
            >
              Are you sure you want to logout?
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              You will leave your JobMatch account and need to sign in again to
              access your resume and applications.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="h-11 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-full bg-rose-600 px-5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700"
              >
                Logout
              </Link>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
