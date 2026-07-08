import {
  adminStats,
  recentApplications,
  recentJobPosts,
  recentSignups,
} from "./admin-data";
import { Card } from "./components";

const activityGroups = [
  {
    title: "Recent Job Posts",
    description: "Newest roles added by companies",
    items: recentJobPosts,
    accent: "bg-cyan-100 text-cyan-700",
    marker: "JP",
  },
  {
    title: "Recent Applications",
    description: "Latest candidates applying to jobs",
    items: recentApplications,
    accent: "bg-emerald-100 text-emerald-700",
    marker: "AP",
  },
  {
    title: "Recent Signups",
    description: "Newest users joining JobMatch",
    items: recentSignups,
    accent: "bg-indigo-100 text-indigo-700",
    marker: "SU",
  },
];

const statStyles = [
  {
    panel: "from-cyan-50 to-white",
    badge: "bg-cyan-600",
    code: "US",
  },
  {
    panel: "from-indigo-50 to-white",
    badge: "bg-indigo-600",
    code: "JB",
  },
  {
    panel: "from-emerald-50 to-white",
    badge: "bg-emerald-600",
    code: "AP",
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
                {statStyles[index].code}
              </span>
            </div>
            <p className="mt-4 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-cyan-100/70">
              {stat.detail}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {activityGroups.map((group) => (
          <Card key={group.title} className="flex min-h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black">{group.title}</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {group.description}
                </p>
              </div>
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xs font-black ${group.accent}`}
              >
                {group.marker}
              </span>
            </div>
            <div className="mt-5 divide-y divide-cyan-50">
              {group.items.map((activity, index) => (
                <div
                  key={activity}
                  className="flex items-start gap-4 py-4 text-sm font-semibold leading-6 text-slate-700 first:pt-0 last:pb-0"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600">
                    {index + 1}
                  </span>
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
