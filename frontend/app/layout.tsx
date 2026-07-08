import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobMatch | AI Resume Analysis and Job Matching",
  description:
    "Analyze your resume, improve your score, check ATS readiness, and discover jobs matched to your skills.",
};

const extensionAttributeCleanup = `
(() => {
  const attributeNames = ["bis_skin_checked", "fdprocessedid"];

  const clean = (node) => {
    if (!(node instanceof Element)) {
      return;
    }

    attributeNames.forEach((attributeName) => {
      node.removeAttribute(attributeName);
      node.querySelectorAll("[" + attributeName + "]").forEach((element) => {
        element.removeAttribute(attributeName);
      });
    });
  };

  clean(document.documentElement);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        clean(mutation.target);
        continue;
      }

      mutation.addedNodes.forEach(clean);
    }
  }).observe(document.documentElement, {
    attributeFilter: attributeNames,
    attributes: true,
    childList: true,
    subtree: true,
  });
})();
`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: extensionAttributeCleanup }} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
