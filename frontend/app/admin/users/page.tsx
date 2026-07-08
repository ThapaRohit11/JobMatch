import { users } from "../admin-data";
import {
  ActionButton,
  Card,
  ConfirmationStrip,
  DangerButton,
  EmptyState,
  PageHeader,
  Pagination,
  StatusBadge,
  Toolbar,
} from "../components";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Search, filter, view, edit, delete, block, and unblock candidate accounts."
      />
      <Toolbar placeholder="Search users by name or email" filter="All users" />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Joined</th>
                <th className="pb-3">Actions</th>
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
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <ActionButton>View</ActionButton>
                      <ActionButton>Edit</ActionButton>
                      <ActionButton>
                        {user.status === "Blocked" ? "Unblock" : "Block"}
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
      <ConfirmationStrip />
      <EmptyState label="users matching archived filters" />
    </div>
  );
}
