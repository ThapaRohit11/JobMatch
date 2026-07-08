import { companies } from "../admin-data";
import {
  ActionButton,
  Card,
  DangerButton,
  PageHeader,
  PrimaryLink,
  Toolbar,
} from "../components";

export default function AdminCompaniesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Manage partner company profiles, logos, industries, locations, and active job counts."
        action={<PrimaryLink href="/admin/jobs/add">Add Company</PrimaryLink>}
      />
      <Toolbar placeholder="Search companies by name or industry" filter="All industries" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {companies.map((company) => (
          <Card key={company.name}>
            <div className="flex items-start justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white">
                {company.logo}
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {company.jobs} jobs
              </span>
            </div>
            <h2 className="mt-5 text-lg font-black">{company.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{company.industry}</p>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              {company.location}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ActionButton>Edit</ActionButton>
              <DangerButton>Delete</DangerButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
