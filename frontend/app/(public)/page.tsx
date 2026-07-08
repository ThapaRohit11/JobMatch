import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "250K+", label: "Resumes analyzed" },
  { value: "18K+", label: "Hiring companies" },
  { value: "1M+", label: "Job matches created" },
];

const features = [
  {
    title: "AI Resume Analysis",
    description:
      "Get instant feedback on structure, clarity, impact, keywords, and role alignment.",
  },
  {
    title: "Resume Score",
    description:
      "Understand your readiness with a detailed score that highlights what to improve next.",
  },
  {
    title: "ATS Check",
    description:
      "Find formatting, keyword, and parsing issues before your resume reaches recruiters.",
  },
  {
    title: "Smart Job Matching",
    description:
      "Match with roles based on skills, experience, location preferences, and career goals.",
  },
  {
    title: "Skill Gap Analysis",
    description:
      "See which skills top job descriptions ask for and what your resume is missing.",
  },
  {
    title: "Career Recommendations",
    description:
      "Receive practical next steps for stronger applications and smarter job targeting.",
  },
];

const steps = [
  "Upload Resume",
  "AI Analysis",
  "Get Resume Score",
  "Find Matching Jobs",
];

const testimonials = [
  {
    name: "Priya N.",
    role: "Product Manager",
    image: "/images/testimonial-priya.png",
    quote:
      "JobMatch helped me rewrite vague bullet points into measurable outcomes. My resume score jumped from 62 to 91, and I landed interviews within two weeks.",
  },
  {
    name: "Rahul M.",
    role: "Software Engineer",
    image: "/images/testimonial-rahul.png",
    quote:
      "The ATS check caught formatting issues I never noticed. The job matches were also far more relevant than what I was seeing on generic job boards.",
  },
  {
    name: "Elena V.",
    role: "HR Director",
    image: "/images/testimonial-elena.png",
    quote:
      "We recommend JobMatch to candidates because it gives clear, actionable guidance instead of generic resume advice. The experience feels premium and precise.",
  },
];

const companies = ["Google", "Microsoft", "Amazon", "Apple", "Meta"];

const footerLinks = ["About", "Contact", "Privacy Policy", "Terms"];

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.224a1 1 0 1 1 1.42-1.408l4.04 4.073 6.54-6.593a1 1 0 0 1 1.414-.006Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SocialIcon({ label }: { label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-blue-300 hover:bg-blue-500"
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M5 19 19 5" />
        <path d="M8 5h11v11" />
      </svg>
    </a>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
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
            <a href="#features" className="transition hover:text-blue-700">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-blue-700">
              How it works
            </a>
            <a href="#testimonials" className="transition hover:text-blue-700">
              Reviews
            </a>
            <a href="#trusted" className="transition hover:text-blue-700">
              Companies
            </a>
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

      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_80%_16%,rgba(124,58,237,0.13),transparent_30%),linear-gradient(180deg,#eff6ff_0%,#ffffff_62%)]" />
        <div className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/75 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              AI-powered resume analysis and job matching
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Analyze Your Resume. Find Your Perfect Job.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              JobMatch reads your resume like a recruiter and evaluates it like
              an ATS. Get a clear resume score, skill-gap insights, and curated
              job matches that fit your experience and goals.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center rounded-full bg-blue-600 px-7 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Upload Resume
              </Link>
              <Link
                href="/user"
                className="inline-flex h-14 items-center justify-center rounded-full border border-blue-200 bg-white/80 px-7 text-base font-bold text-blue-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50"
              >
                Explore Jobs
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 text-sm font-medium text-slate-600 sm:grid-cols-3">
              {["ATS-ready feedback", "Role-based scoring", "Private by design"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-blue-700">
                      <CheckIcon />
                    </span>
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-400/20 via-white to-violet-400/20 blur-2xl" />
            <div className="rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-2xl shadow-blue-900/12 backdrop-blur-xl">
              <Image
                src="/images/resumeai-hero.png"
                alt="AI analyzing a resume and matching jobs"
                width={1536}
                height={1024}
                priority
                className="h-auto w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-blue-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-10 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-blue-100 bg-blue-50/50 p-8 text-center shadow-sm"
            >
              <p className="text-4xl font-black text-blue-700">{stat.value}</p>
              <p className="mt-2 font-semibold text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
              Everything your resume needs
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Build a stronger application with AI that explains every result.
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-3xl border border-white bg-white/80 p-7 shadow-xl shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/50"
              >
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white shadow-lg shadow-blue-500/25">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                How it works
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                From resume upload to matched roles in minutes.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                The platform combines resume parsing, scoring, ATS simulation,
                and job-market intelligence into one guided workflow.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="relative rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-7 shadow-lg shadow-blue-100/50"
                >
                  <span className="text-sm font-black text-violet-600">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-3 text-2xl font-bold">{step}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {index === 0 &&
                      "Upload a PDF or DOCX resume and select your target role."}
                    {index === 1 &&
                      "Our AI analyzes content, keywords, formatting, and impact."}
                    {index === 2 &&
                      "Review a clear score with prioritized improvements."}
                    {index === 3 &&
                      "Explore job matches ranked by skill fit and career path."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-blue-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-200">
              User stories
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Trusted by job seekers and hiring teams.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-3xl border border-white/15 bg-white/10 p-7 shadow-2xl shadow-black/10 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} profile photo`}
                    width={80}
                    height={80}
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-white/15"
                  />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-blue-100">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-6 leading-8 text-blue-50">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trusted" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-bold uppercase tracking-wide text-slate-500">
            Trusted by candidates applying to teams at
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {companies.map((company) => (
              <div
                key={company}
                className="grid h-24 place-items-center rounded-3xl border border-slate-200 bg-white text-xl font-black text-slate-500 shadow-sm"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-black">
                JM
              </span>
              <span className="text-lg font-bold">JobMatch</span>
            </div>
            <p className="mt-5 max-w-xl leading-8 text-slate-300">
              AI-powered resume analysis, ATS optimization, and intelligent job
              matching for professionals ready to move faster.
            </p>
          </div>
          <div className="lg:text-right">
            <div className="flex flex-wrap gap-4 lg:justify-end">
              {footerLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm font-semibold text-slate-300 transition hover:text-white"
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="mt-6 flex gap-3 lg:justify-end">
              <SocialIcon label="X" />
              <SocialIcon label="LinkedIn" />
              <SocialIcon label="Instagram" />
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-400">
          Copyright 2026 JobMatch. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
