"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(isAdminLogin ? "/admin" : "/user");
      }}
      className="w-full rounded-3xl border border-white/80 bg-white/80 p-7 shadow-2xl shadow-blue-900/10 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isAdminLogin ? "Admin login" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isAdminLogin
              ? "Sign in to manage jobs, users, and resume matches."
              : "Access your candidate workspace and job matches."}
          </p>
        </div>
        {isAdminLogin && (
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
            Admin
          </span>
        )}
      </div>

      <label className="mt-6 block text-sm font-semibold text-slate-800">
        Email
        <input
          type="email"
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder={isAdminLogin ? "admin@jobmatch.com" : "you@example.com"}
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-slate-800">
        Password
        <input
          type="password"
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Enter password"
        />
      </label>

      <button
        type="submit"
        className="mt-6 h-12 w-full rounded-full bg-blue-600 font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        {isAdminLogin ? "Login as admin" : "Login"}
      </button>

      <p className="mt-5 text-center text-sm text-slate-600">
        {isAdminLogin ? "Not an admin?" : "Are you an admin?"}{" "}
        <button
          type="button"
          onClick={() => setIsAdminLogin((current) => !current)}
          className="font-bold text-blue-700"
        >
          {isAdminLogin ? "Candidate login" : "Admin login"}
        </button>
      </p>

      <p className="mt-5 text-center text-sm text-slate-600">
        New here?{" "}
        <Link href="/signup" className="font-bold text-blue-700">
          Create an account
        </Link>
      </p>
    </form>
  );
}
