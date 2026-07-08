import Link from "next/link";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/jobs/add", label: "Add Job" },
  { href: "/admin/resumes", label: "Resumes" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-blue-100 bg-white/90 px-5 py-5 shadow-xl shadow-blue-100/50 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white shadow-lg shadow-blue-500/25">
            JM
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight">
              JobMatch
            </span>
            <span className="text-xs font-medium text-slate-500">
              Admin Console
            </span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {link.label}
              <span className="h-2 w-2 rounded-full bg-blue-200" />
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
          <p className="text-sm font-black text-slate-900">Pro admin tip</p>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Review low resume scores daily to improve candidate outcomes.
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/85 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between gap-4 px-6">
            <div className="min-w-0 flex-1">
              <input
                className="h-11 w-full max-w-xl rounded-full border border-blue-100 bg-blue-50/50 px-5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Search users, jobs, resumes, companies"
              />
            </div>
            <button
              aria-label="Notifications"
              className="grid h-11 w-11 place-items-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-sm"
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
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="hidden items-center gap-3 rounded-full border border-blue-100 bg-white px-3 py-2 shadow-sm sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-black text-white">
                AD
              </div>
              <div className="text-sm">
                <p className="font-bold">Admin User</p>
                <p className="text-xs text-slate-500">admin@jobmatch.com</p>
              </div>
            </div>
          </div>
        </header>

        <div className="block border-b border-blue-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-full border border-blue-100 px-4 py-2 text-xs font-bold text-slate-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <section className="px-6 py-8">{children}</section>
      </div>
    </main>
  );
}
