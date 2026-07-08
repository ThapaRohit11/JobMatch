import Link from "next/link";

const links = [
  { href: "/user", label: "Dashboard" },
  { href: "/user/applications", label: "Applications" },
  { href: "/user/profile", label: "Profile" },
];

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-6">
        <nav className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-xl font-semibold">
            JobMatch User
          </Link>
          <div className="flex flex-wrap gap-2 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md border border-zinc-300 px-3 py-2 transition hover:border-teal-700 hover:text-teal-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
        <section className="py-8">{children}</section>
      </div>
    </main>
  );
}
