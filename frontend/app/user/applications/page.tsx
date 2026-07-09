import { userApplications } from "../user-data";

function statusClasses(status: string) {
  if (status === "Accepted") {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (status === "In Review") {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }

  if (status === "Pending") {
    return "border-amber-100 bg-amber-50 text-amber-700";
  }

  return "border-rose-100 bg-rose-50 text-rose-700";
}

export default function UserApplicationsPage() {
  const inReview = userApplications.filter(
    (application) => application.status === "In Review",
  ).length;
  const pending = userApplications.filter(
    (application) => application.status === "Pending",
  ).length;
  const accepted = userApplications.filter(
    (application) => application.status === "Accepted",
  ).length;
  const rejected = userApplications.filter(
    (application) => application.status === "Rejected",
  ).length;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Applications
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
          Track every role you applied to and see the latest application status.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-blue-600">Total Applied</p>
          <p className="mt-2 text-3xl font-black text-blue-700">
            {userApplications.length}
          </p>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-amber-700">Pending</p>
          <p className="mt-2 text-3xl font-black text-amber-700">{pending}</p>
        </div>
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-cyan-700">In Review</p>
          <p className="mt-2 text-3xl font-black text-cyan-700">{inReview}</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-emerald-700">Accepted</p>
          <p className="mt-2 text-3xl font-black text-emerald-700">
            {accepted}
          </p>
        </div>
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5 shadow-sm shadow-slate-900/10">
          <p className="text-sm font-bold text-rose-700">Rejected</p>
          <p className="mt-2 text-3xl font-black text-rose-700">{rejected}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-slate-50 text-sm font-bold text-slate-500">
              <tr>
                <th className="px-8 py-5">Job</th>
                <th className="px-8 py-5">Company / Location</th>
                <th className="px-8 py-5">Applied Date</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userApplications.map((application) => (
                <tr
                  key={application.title}
                  className="transition hover:bg-cyan-50/35"
                >
                  <td className="px-8 py-6">
                    <p className="text-lg font-black text-slate-950">
                      {application.title}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-xs font-black text-white">
                        {application.logo}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {application.company}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-400">
                          {application.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-semibold text-slate-700">
                    {application.applied}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex min-w-28 justify-center rounded-full border px-3.5 py-2 text-xs font-black ${statusClasses(application.status)}`}
                    >
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
