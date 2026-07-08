import { resumes } from "../admin-data";
import {
  ActionButton,
  Card,
  DangerButton,
  PageHeader,
  Pagination,
  Toolbar,
} from "../components";

export default function AdminResumesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumes"
        description="Review uploaded resumes, resume score, candidate target roles, and remove outdated files."
      />
      <Toolbar placeholder="Search resumes by candidate or role" filter="All scores" />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Upload Date</th>
                <th className="pb-3">Target Role</th>
                <th className="pb-3">Resume Score</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {resumes.map((resume) => (
                <tr key={resume.candidate}>
                  <td className="py-4 font-bold">{resume.candidate}</td>
                  <td className="py-4 text-slate-500">{resume.uploaded}</td>
                  <td className="py-4">{resume.role}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                      {resume.score}/100
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <ActionButton>View</ActionButton>
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
