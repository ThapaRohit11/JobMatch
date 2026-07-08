import { Card, PageHeader } from "../components";

const settings = [
  { label: "Email notifications", value: "Enabled" },
  { label: "Dark mode", value: "System" },
  { label: "Language", value: "English" },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure platform preferences, notification behavior, theme, language, and account session actions."
      />
      <Card>
        <form className="space-y-5">
          <label className="block text-sm font-bold text-slate-800">
            Site name
            <input
              className="mt-2 h-12 w-full max-w-xl rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              defaultValue="JobMatch"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            {settings.map((setting) => (
              <label
                key={setting.label}
                className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-5 text-sm font-bold text-slate-800"
              >
                {setting.label}
                <select className="mt-3 h-11 w-full rounded-xl border border-cyan-100 bg-white px-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
                  <option>{setting.value}</option>
                  <option>Disabled</option>
                  <option>Enabled</option>
                </select>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
              Save settings
            </button>
            <button className="h-12 rounded-full border border-rose-100 bg-white px-7 text-sm font-bold text-rose-600 transition hover:bg-rose-50">
              Logout
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
