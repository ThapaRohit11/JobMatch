import { applications } from "../admin-data";
import {
  ActionButton,
  Card,
  PageHeader,
  Pagination,
  StatusBadge,
  Toolbar,
} from "../components";

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Track candidates, target jobs, companies, application dates, and status across the hiring pipeline."
      />
      <Toolbar
        placeholder="Search applications by applicant, job, or company"
        filter="All statuses"
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="pb-3">Applicant</th>
                <th className="pb-3">Job Title</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {applications.map((application) => (
                <tr key={`${application.applicant}-${application.job}`}>
                  <td className="py-4 font-bold">{application.applicant}</td>
                  <td className="py-4">{application.job}</td>
                  <td className="py-4">{application.company}</td>
                  <td className="py-4 text-slate-500">{application.date}</td>
                  <td className="py-4">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="py-4">
                    <ActionButton>View application</ActionButton>
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
