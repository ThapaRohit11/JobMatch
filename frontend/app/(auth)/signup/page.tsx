import Link from "next/link";

export default function SignupPage() {
  return (
    <form className="w-full rounded-3xl border border-white/80 bg-white/80 p-7 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
      <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
      <p className="mt-2 text-sm text-slate-600">
        Start matching your resume with the right jobs.
      </p>

      <label className="mt-6 block text-sm font-semibold text-slate-800">
        Full name
        <input
          type="text"
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Your name"
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-slate-800">
        Email
        <input
          type="email"
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="you@example.com"
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-slate-800">
        Password
        <input
          type="password"
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Create a password"
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-slate-800">
        Confirm password
        <input
          type="password"
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Confirm your password"
        />
      </label>

      <button className="mt-6 h-12 w-full rounded-full bg-blue-600 font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-700">
        Create account
      </button>

      <p className="mt-5 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-bold text-blue-700">
          Login
        </Link>
      </p>
    </form>
  );
}
