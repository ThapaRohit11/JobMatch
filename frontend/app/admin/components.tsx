import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-blue-100 bg-white p-6 shadow-sm shadow-blue-100/70 ${className}`}
    >
      {children}
    </section>
  );
}

export function Toolbar({
  placeholder = "Search",
  filter = "All",
  action,
}: {
  placeholder?: string;
  filter?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <input
        className="h-11 min-w-0 flex-1 rounded-2xl border border-blue-100 bg-blue-50/40 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        placeholder={placeholder}
      />
      <div className="flex flex-wrap gap-3">
        <select className="h-11 rounded-2xl border border-blue-100 bg-white px-4 text-sm font-semibold text-slate-700 outline-none">
          <option>{filter}</option>
          <option>Active</option>
          <option>Blocked</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
        {action}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const positive = ["Active", "Open", "Interview", "Shortlisted"].includes(
    status,
  );
  const warning = ["In Review", "Pending"].includes(status);
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        positive
          ? "bg-blue-100 text-blue-700"
          : warning
            ? "bg-violet-100 text-violet-700"
            : "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full border border-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50">
      {children}
    </button>
  );
}

export function DangerButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full border border-rose-100 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50">
      {children}
    </button>
  );
}

export function Pagination() {
  return (
    <div className="flex items-center justify-between border-t border-blue-50 pt-4 text-sm text-slate-500">
      <span>Showing 1-4 of 248 results</span>
      <div className="flex gap-2">
        <button className="rounded-full border border-blue-100 px-3 py-1.5 font-semibold">
          Previous
        </button>
        <button className="rounded-full bg-blue-600 px-3 py-1.5 font-semibold text-white">
          1
        </button>
        <button className="rounded-full border border-blue-100 px-3 py-1.5 font-semibold">
          2
        </button>
      </div>
    </div>
  );
}

export function ConfirmationStrip({
  type = "delete",
}: {
  type?: "delete" | "success";
}) {
  return (
    <div
      className={`rounded-3xl border p-4 text-sm ${
        type === "success"
          ? "border-blue-100 bg-blue-50 text-blue-800"
          : "border-rose-100 bg-rose-50 text-rose-700"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">
          {type === "success"
            ? "Success popup: changes saved and the admin record is up to date."
            : "Delete confirmation popup: confirm before removing this record."}
        </p>
        <div className="flex gap-2">
          <button className="rounded-full bg-white px-4 py-2 font-bold shadow-sm">
            Cancel
          </button>
          <button
            className={`rounded-full px-4 py-2 font-bold text-white ${
              type === "success" ? "bg-blue-600" : "bg-rose-600"
            }`}
          >
            {type === "success" ? "Done" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 p-8 text-center">
      <p className="font-bold text-slate-800">No {label} found</p>
      <p className="mt-2 text-sm text-slate-500">
        Try changing filters or creating a new record.
      </p>
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
    >
      {children}
    </Link>
  );
}
