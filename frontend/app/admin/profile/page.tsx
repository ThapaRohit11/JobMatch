import { Card, ConfirmationStrip, PageHeader } from "../components";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage admin identity, profile photo, contact email, and password security."
      />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <div className="grid place-items-center text-center">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-3xl font-black text-white shadow-xl shadow-blue-500/20">
              AD
            </div>
            <h2 className="mt-5 text-xl font-black">Admin User</h2>
            <p className="mt-1 text-sm text-slate-500">admin@jobmatch.com</p>
            <button className="mt-5 rounded-full border border-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
              Upload photo
            </button>
          </div>
        </Card>
        <Card>
          <form className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-bold text-slate-800">
              Admin name
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-blue-50/30 px-4"
                defaultValue="Admin User"
              />
            </label>
            <label className="text-sm font-bold text-slate-800">
              Email
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-blue-50/30 px-4"
                defaultValue="admin@jobmatch.com"
              />
            </label>
            <label className="text-sm font-bold text-slate-800">
              New password
              <input
                type="password"
                className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-blue-50/30 px-4"
                placeholder="Enter new password"
              />
            </label>
            <label className="text-sm font-bold text-slate-800">
              Confirm password
              <input
                type="password"
                className="mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-blue-50/30 px-4"
                placeholder="Confirm password"
              />
            </label>
            <div className="md:col-span-2">
              <button className="h-12 rounded-full bg-blue-600 px-7 text-sm font-bold text-white">
                Edit profile
              </button>
            </div>
          </form>
        </Card>
      </div>
      <ConfirmationStrip type="success" />
    </div>
  );
}
