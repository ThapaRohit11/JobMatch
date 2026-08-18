"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSavedUserJobs, setUserJobSaved, type UserJob } from "../../../lib/user-api";
import { formatJobDeadline, isJobClosed } from "../../../lib/job-deadline";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSavedUserJobs()
      .then((data) => setJobs(data.jobs))
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load saved jobs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Saved Jobs</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Your saved opportunities</h1>
          <p className="mt-2 text-slate-600">Keep interesting roles here and return to them when you are ready.</p>
        </div>
        <Link href="/user/jobs" className="inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700">Browse Job Matches</Link>
      </div>

      {error && <p role="alert" className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</p>}
      {loading && <p className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-500">Loading saved jobs...</p>}
      {!loading && jobs.length === 0 && (
        <section className="rounded-3xl border border-dashed border-indigo-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-black text-slate-900">No saved jobs yet</h2>
          <p className="mt-2 text-slate-600">Use the bookmark icon on a Job Match card to save it here.</p>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        {jobs.map((job) => {
          const closed = isJobClosed(job);
          return (
            <article key={job.id} className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-xs font-black text-white">{job.logo}</div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-black text-slate-950">{job.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{job.company} - {job.location}</p>
                  </div>
                </div>
                <button type="button" aria-label={`Remove ${job.title} from saved jobs`} title="Remove from saved jobs" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 transition hover:bg-indigo-100" onClick={async () => {
                  try {
                    setError("");
                    await setUserJobSaved(job.id, false);
                    setJobs((currentJobs) => currentJobs.filter((item) => item.id !== job.id));
                  } catch (removeError) {
                    setError(removeError instanceof Error ? removeError.message : "Unable to remove saved job");
                  }
                }}>
                  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" /></svg>
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Type</p><p className="mt-1 text-sm font-black text-slate-800">{job.type}</p></div>
                <div className="rounded-2xl bg-rose-50 p-4"><p className="text-xs font-black uppercase text-rose-300">Apply By</p><p className="mt-1 text-sm font-black text-rose-700">{formatJobDeadline(job.applyBy)}</p></div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className={`rounded-full px-3 py-1.5 text-xs font-black ${closed ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>{closed ? "Closed" : "Open"}</span>
                <Link href={`/user/jobs?job=${job.id}&from=saved`} className={`rounded-full px-5 py-2.5 text-sm font-black transition ${closed ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-cyan-600 text-white hover:bg-cyan-700"}`}>{closed ? "View Details" : "View & Apply"}</Link>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
