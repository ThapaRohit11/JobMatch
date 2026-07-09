"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/user", label: "Dashboard" },
  { href: "/user/jobs", label: "Jobs" },
  { href: "/user/applications", label: "Applications" },
  { href: "/user/resume", label: "Resume" },
  { href: "/user/profile", label: "Profile" },
];

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#ecfeff_0%,#f8fafc_45%,#eef2ff_100%)] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-cyan-100/80 bg-white/90 px-4 py-5 shadow-xl shadow-cyan-900/10 backdrop-blur-xl lg:flex lg:flex-col">
        <Link
          href="/user"
          className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50 p-4 shadow-sm shadow-cyan-900/5"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
              JM
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight">
                JobMatch
              </span>
              <span className="text-xs font-bold uppercase text-cyan-700">
                Candidate
              </span>
            </span>
          </span>
        </Link>

        <nav className="mt-6 space-y-1.5">
          {links.map((link) => {
            const isActive =
              link.href === "/user"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                {link.label}
                <span
                  className={`h-2 w-2 rounded-full ${
                    isActive ? "bg-white" : "bg-cyan-200"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-sm font-black text-rose-600 transition hover:bg-rose-100"
        >
          Logout
        </button>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-cyan-100/80 bg-white/85 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between gap-4 px-6">
            <Link href="/user" className="text-lg font-black lg:hidden">
              JobMatch
            </Link>
            <div className="ml-auto flex items-center gap-3 rounded-full border border-cyan-100 bg-white px-3 py-2 shadow-sm">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-xs font-black text-white">
                JS
              </div>
              <div className="hidden text-sm sm:block">
                <p className="font-bold">John Smith</p>
                <p className="text-xs text-slate-500">john.smith@email.com</p>
              </div>
            </div>
          </div>
        </header>

        <div className="block border-b border-cyan-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {links.map((link) => {
              const isActive =
                link.href === "/user"
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
