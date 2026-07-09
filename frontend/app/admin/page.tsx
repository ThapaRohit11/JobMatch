import {
  adminStats,
  recentApplications,
  recentJobPosts,
} from "./admin-data";
import { Card } from "./components";

const activityGroups = [
  {
    title: "Recent Job Posts",
    description: "Newest roles added by companies",
    items: recentJobPosts,
    accent: "from-cyan-500 to-blue-600 shadow-cyan-500/20",
    icon: (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="7" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 12h20M10 12v2h4v-2" />
      </svg>
    ),
  },
  {
    title: "Recent Applications",
    description: "Latest candidates applying to jobs",
    items: recentApplications,
    accent: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    icon: (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M9 13h6M9 17h4" />
      </svg>
    ),
  },
];

const statStyles = [
  {
    panel: "from-cyan-50 to-white",
    badge: "bg-cyan-600",
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    panel: "from-indigo-50 to-white",
    badge: "bg-indigo-600",
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="7" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 12h20M10 12v2h4v-2" />
      </svg>
    ),
  },
  {
    panel: "from-emerald-50 to-white",
    badge: "bg-emerald-600",
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M9 13h6M9 17h6" />
      </svg>
    ),
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-cyan-100/80 bg-white shadow-sm shadow-cyan-900/5">
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 px-6 py-7 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-100">
                Admin Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Welcome back, Admin
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-cyan-50">
                Quickly review platform totals, fresh job posts, new
                applications, and recent account signups.
              </p>
            </div>
            <div className="grid gap-2 rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-sm font-bold backdrop-blur sm:min-w-52">
              <span className="text-cyan-100">Today</span>
              <span className="text-2xl font-black">Live Overview</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {adminStats.map((stat, index) => (
          <Card
            key={stat.label}
            className={`bg-gradient-to-br ${statStyles[index].panel}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                  {stat.value}
                </p>
              </div>
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xs font-black text-white shadow-lg shadow-slate-900/10 ${statStyles[index].badge}`}
              >
                {statStyles[index].icon}
              </span>
            </div>
            <p className="mt-4 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-cyan-100/70">
              {stat.detail}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {activityGroups.map((group) => (
          <Card
            key={group.title}
            className="flex min-h-full flex-col overflow-hidden border-cyan-100/80"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {group.title}
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {group.description}
                </p>
              </div>
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${group.accent}`}
              >
                {group.icon}
              </span>
            </div>
            <div className="mt-2 divide-y divide-cyan-50">
              {group.items.map((activity, index) => (
                <div
                  key={activity}
                  className="group flex items-start gap-4 rounded-xl px-2 py-4 text-sm font-semibold leading-6 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700 transition group-hover:bg-cyan-100">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                  <span className="flex-1">{activity}</span>
                  <span className="mt-1 text-xs font-black text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
