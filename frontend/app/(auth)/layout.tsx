import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_80%_16%,rgba(124,58,237,0.13),transparent_30%),linear-gradient(180deg,#eff6ff_0%,#ffffff_68%)] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white shadow-lg shadow-blue-500/25">
              JM
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">
                JobMatch
              </span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">
                Resume intelligence platform
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex">
            <Link href="/#features" className="transition hover:text-blue-700">
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="transition hover:text-blue-700"
            >
              How it works
            </Link>
            <Link
              href="/#testimonials"
              className="transition hover:text-blue-700"
            >
              Reviews
            </Link>
            <Link href="/#trusted" className="transition hover:text-blue-700">
              Companies
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_0.86fr]">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/75 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            AI-powered resume analysis and job matching
          </div>
          <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">
            Analyze Your Resume. Find Your Perfect Job.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Sign in to upload your resume, get an AI resume score, check ATS
            readiness, and discover jobs matched to your skills.
          </p>
        </div>
        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          {children}
        </div>
      </section>
    </main>
  );
}
