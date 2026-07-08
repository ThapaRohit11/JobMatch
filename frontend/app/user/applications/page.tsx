const applications = ["Frontend Developer", "Data Analyst", "Product Intern"];

export default function UserApplicationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Applications</h1>
      <div className="mt-6 space-y-3">
        {applications.map((role) => (
          <div
            key={role}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <p className="font-medium">{role}</p>
            <p className="mt-1 text-sm text-zinc-600">Status: In review</p>
          </div>
        ))}
      </div>
    </div>
  );
}
