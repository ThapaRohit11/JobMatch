"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authRequest } from "../../../lib/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
          await authRequest("/api/auth/signup", {
            name,
            email,
            password,
            confirmPassword,
            role: "user",
          });

          localStorage.removeItem("jobmatchToken");
          localStorage.removeItem("jobmatchUser");
          router.push("/login");
        } catch (authError) {
          setError(authError instanceof Error ? authError.message : "Signup failed");
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="w-full rounded-3xl border border-white/80 bg-white/80 p-7 shadow-2xl shadow-blue-900/10 backdrop-blur-xl"
    >
      <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
      <p className="mt-2 text-sm text-slate-600">
        Start matching your resume with the right jobs.
      </p>

      <label className="mt-6 block text-sm font-semibold text-slate-800">
        Full name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Your name"
          required
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-slate-800">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-slate-800">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Create a password"
          required
          minLength={6}
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-slate-800">
        Confirm password
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Confirm your password"
          required
          minLength={6}
        />
      </label>

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        disabled={isSubmitting}
        className="mt-6 h-12 w-full rounded-full bg-blue-600 font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
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
