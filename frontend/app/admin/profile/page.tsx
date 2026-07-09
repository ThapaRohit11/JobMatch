export default function AdminProfilePage() {
  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="bg-gradient-to-r from-cyan-50 via-white to-indigo-50 px-6 py-7 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-2xl font-black text-white shadow-xl shadow-cyan-500/20">
                AD
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  Admin User
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  admin@jobmatch.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <form className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
            <h2 className="text-xl font-black text-slate-950 md:col-span-2">
              Account Details
            </h2>
            <label className="text-sm font-bold text-slate-800">
              Admin name
              <input
                className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                defaultValue="Admin User"
              />
            </label>
            <label className="text-sm font-bold text-slate-800">
              Email
              <input
                className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                defaultValue="admin@jobmatch.com"
              />
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
                Save Profile
              </button>
            </div>
            <div className="mt-2 border-t border-slate-100 pt-5 md:col-span-2">
              <h2 className="text-xl font-black text-slate-950">
                Security
              </h2>
            </div>
            <label className="text-sm font-bold text-slate-800 md:col-span-2">
              Old password
              <input
                type="password"
                autoComplete="current-password"
                className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                placeholder="Enter old password"
              />
            </label>
            <label className="text-sm font-bold text-slate-800">
              New password
              <input
                type="password"
                autoComplete="new-password"
                className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                placeholder="Enter new password"
              />
            </label>
            <label className="text-sm font-bold text-slate-800">
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                placeholder="Confirm password"
              />
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
