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
              className="mt-2 h-12 w-full max-w-xl rounded-2xl border border-blue-100 bg-blue-50/30 px-4"
              defaultValue="JobMatch"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            {settings.map((setting) => (
              <label
                key={setting.label}
                className="rounded-3xl border border-blue-100 bg-blue-50/40 p-5 text-sm font-bold text-slate-800"
              >
                {setting.label}
                <select className="mt-3 h-11 w-full rounded-2xl border border-blue-100 bg-white px-3 outline-none">
                  <option>{setting.value}</option>
                  <option>Disabled</option>
                  <option>Enabled</option>
                </select>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="h-12 rounded-full bg-blue-600 px-7 text-sm font-bold text-white">
              Save settings
            </button>
            <button className="h-12 rounded-full border border-rose-100 px-7 text-sm font-bold text-rose-600">
              Logout
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
