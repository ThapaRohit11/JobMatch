import { jobs } from "../admin-data";
import {
  ActionButton,
  Card,
  DangerButton,
  PageHeader,
  Pagination,
  PrimaryLink,
  StatusBadge,
  Toolbar,
} from "../components";

export default function AdminJobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Manage job posts, edit listing details, delete expired roles, and toggle open or closed status."
        action={<PrimaryLink href="/admin/jobs/add">Add Job</PrimaryLink>}
      />
      <Toolbar
        placeholder="Search jobs by title, company, or location"
        filter="All jobs"
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="pb-3">Job</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Salary</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {jobs.map((job) => (
                <tr key={job.title}>
                  <td className="py-4">
                    <p className="font-bold">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.type}</p>
                  </td>
                  <td className="py-4">{job.company}</td>
                  <td className="py-4 text-slate-500">{job.location}</td>
                  <td className="py-4">{job.salary}</td>
                  <td className="py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <ActionButton>Edit</ActionButton>
                      <ActionButton>
                        {job.status === "Open" ? "Close" : "Open"}
                      </ActionButton>
                      <DangerButton>Delete</DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          <Pagination />
        </div>
      </Card>
    </div>
  );
}
