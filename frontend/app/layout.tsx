import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobMatch | AI Resume Analysis and Job Matching",
  description:
    "Analyze your resume, improve your score, check ATS readiness, and discover jobs matched to your skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
