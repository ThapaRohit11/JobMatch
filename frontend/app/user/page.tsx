const stats = [
  { label: "Recommended jobs", value: "24" },
  { label: "Applications sent", value: "8" },
  { label: "Interviews", value: "3" },
];

export default function UserDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">User dashboard</h1>
      <p className="mt-2 text-zinc-600">
        Candidate-focused workspace for job matches and application progress.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-zinc-200 bg-white p-5"
          >
            <p className="text-sm text-zinc-600">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
