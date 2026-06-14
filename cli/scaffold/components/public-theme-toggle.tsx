"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

/** Theme toggle for marketing/auth pages — hidden on dashboard routes (shell has its own). */
export function PublicThemeToggle() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <ThemeToggle />
    </div>
  );
}
