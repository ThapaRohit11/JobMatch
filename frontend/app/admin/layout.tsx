"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <>
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    href: "/admin/jobs",
    label: "Jobs",
    icon: (
      <>
        <rect width="20" height="14" x="2" y="7" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M12 12v3" />
      </>
    ),
  },
  {
    href: "/admin/resumes",
    label: "Resumes",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </>
    ),
  },
  {
    href: "/admin/applications",
    label: "Applications",
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    href: "/admin/companies",
    label: "Companies",
    icon: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V5a2 2 0 0 1 2-2h7v18" />
        <path d="M19 21V9a2 2 0 0 0-2-2h-3" />
        <path d="M9 7h1" />
        <path d="M9 11h1" />
        <path d="M9 15h1" />
      </>
    ),
  },
  {
    href: "/admin/profile",
    label: "Profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </>
    ),
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f0fdfa_0%,#f8fafc_42%,#eef2ff_100%)] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-cyan-100/80 bg-white/90 px-4 py-5 shadow-xl shadow-cyan-900/10 backdrop-blur-xl lg:flex lg:flex-col">
        <Link
          href="/admin"
          className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50 p-4 shadow-sm shadow-cyan-900/5"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
              JM
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight text-slate-950">
                JobMatch
              </span>
              <span className="text-xs font-bold uppercase text-cyan-700">
                Admin Panel
              </span>
            </span>
          </span>
        </Link>

        <nav className="mt-6 space-y-1.5">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-cyan-700"
                  }`}
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
                    {link.icon}
                  </svg>
                </span>
                <span className="min-w-0 flex-1">{link.label}</span>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-cyan-100 bg-white p-3 shadow-sm shadow-cyan-900/5">
          <button
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 text-sm font-black text-rose-600 transition hover:bg-rose-100"
            onClick={() => setShowLogoutConfirm(true)}
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-cyan-100/80 bg-white/85 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-end gap-4 px-6">
            <div className="hidden items-center gap-3 rounded-full border border-cyan-100 bg-white px-3 py-2 shadow-sm sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-xs font-black text-white">
                AD
              </div>
              <div className="text-sm">
                <p className="font-bold">Admin User</p>
                <p className="text-xs text-slate-500">admin@jobmatch.com</p>
              </div>
            </div>
          </div>
        </header>

        <div className="block border-b border-cyan-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
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

        <section className="px-6 py-8">{children}</section>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 px-4 backdrop-blur-md">
          <button
            aria-label="Cancel logout"
            className="absolute inset-0 cursor-default"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <section className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20">
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
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Are you sure you want to logout?
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              You will leave the admin panel and need to sign in again to manage
              JobMatch.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
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
