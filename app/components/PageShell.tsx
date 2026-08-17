import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

// Shared page container. Owns the full page-level padding and max width so the
// home and detail pages cannot drift apart, and so the top offset stays a
// single decision independent of the fixed header's own height.
export function PageShell({ children }: PageShellProps) {
  return <div className="mx-auto max-w-xl px-6 py-24">{children}</div>;
}
