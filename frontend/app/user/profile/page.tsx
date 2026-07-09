import { userProfile } from "../user-data";

export default function UserProfilePage() {
  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-3xl border border-cyan-100/80 bg-white shadow-sm shadow-slate-900/10">
        <div className="bg-gradient-to-r from-cyan-50 via-white to-indigo-50 px-6 py-7 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-2xl font-black text-white shadow-xl shadow-cyan-500/20">
                JS
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  {userProfile.name}
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {userProfile.email}
                </p>
              </div>
            </div>
            <div className="w-fit rounded-2xl border border-cyan-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Joined
              </p>
              <p className="mt-1 text-sm font-black text-cyan-700">
                {userProfile.joined}
              </p>
            </div>
          </div>
        </div>

        <form className="grid gap-5 border-t border-slate-100 p-6 sm:p-8 md:grid-cols-2">
          <h2 className="text-xl font-black text-slate-950 md:col-span-2">
            Profile Details
          </h2>
          <label className="text-sm font-bold text-slate-800">
            Full name
            <input
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              defaultValue={userProfile.name}
            />
          </label>
          <label className="text-sm font-bold text-slate-800">
            Email
            <input
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              defaultValue={userProfile.email}
            />
          </label>
          <label className="text-sm font-bold text-slate-800">
            Target role
            <input
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              defaultValue={userProfile.role}
            />
          </label>
          <label className="text-sm font-bold text-slate-800">
            Location
            <input
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              defaultValue={userProfile.location}
            />
          </label>
          <label className="text-sm font-bold text-slate-800 md:col-span-2">
            Skills
            <input
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              defaultValue={userProfile.skills}
            />
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
              Save Profile
            </button>
          </div>

          <div className="mt-2 border-t border-slate-100 pt-5 md:col-span-2">
            <h2 className="text-xl font-black text-slate-950">
              Resume Summary
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-400">
                <span className="text-5xl font-black text-emerald-600">
                  {userProfile.resumeScore}
                </span>{" "}
                /100
              </p>
              <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                Resume ready for applications
              </span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${userProfile.resumeScore}%` }}
              />
            </div>
          </div>

        </form>

        <form className="grid gap-5 border-t border-slate-100 p-6 sm:p-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className="text-xl font-black text-slate-950">
              Change Password
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Use a strong password that you do not use for other accounts.
            </p>
          </div>
          <label className="text-sm font-bold text-slate-800 md:col-span-2">
            Current password
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your current password"
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <label className="text-sm font-bold text-slate-800">
            New password
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Enter a new password"
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <label className="text-sm font-bold text-slate-800">
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your new password"
              className="mt-2 h-12 w-full rounded-xl border border-cyan-100 bg-cyan-50/40 px-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <div className="md:col-span-2">
            <button className="h-12 rounded-full bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700">
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
