import {
  activities,
  adminStats,
  jobs,
  users,
} from "./admin-data";
import { Card, PageHeader, StatusBadge } from "./components";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Admin"
        description="Monitor platform health, recent users, job posts, resume uploads, and application activity from one polished command center."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              {stat.detail}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-black">Recent Users</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className="py-4">
                      <p className="font-bold">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="py-4">{user.plan}</td>
                    <td className="py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4 text-slate-500">{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-black">Recent Job Posts</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-3">Job</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {jobs.map((job) => (
                  <tr key={job.title}>
                    <td className="py-4 font-bold">{job.title}</td>
                    <td className="py-4">{job.company}</td>
                    <td className="py-4 text-slate-500">{job.type}</td>
                    <td className="py-4">
                      <StatusBadge status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-black">Recent Activities</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {activities.map((activity) => (
            <div
              key={activity}
              className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-sm font-semibold text-slate-700"
            >
              {activity}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
