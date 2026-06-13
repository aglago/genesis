"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@genesis/ui";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/templates", label: "Templates" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center px-6">
        <Link href="/" className="mr-8 flex items-center gap-2 font-semibold tracking-tight">
          Genesis
        </Link>
        <nav className="flex flex-1 items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground",
                pathname.startsWith(link.href)
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/docs/quickstart"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
