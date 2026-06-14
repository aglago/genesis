"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@genesis/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DashboardConfig } from "@genesis/dashboard/config";

interface SessionUser {
  email: string;
  name: string | null;
  role: string;
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardShell({
  config,
  children,
}: {
  config: DashboardConfig;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const sidebar = (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          {config.title}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-auto p-3">
        {config.navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent text-accent-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <p className="truncate text-xs text-muted-foreground">{user?.email ?? "Signed in"}</p>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card text-card-foreground transition-transform md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebar}
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon className="h-4 w-4" />
            </button>
            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              ← Back to site
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-[140px] truncate sm:inline">{user?.name ?? user?.email ?? "Account"}</span>
            </button>
            {menuOpen && (
              <>
                <button type="button" aria-label="Close profile menu" className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-background p-1 shadow-md">
                  <div className="border-b px-3 py-2">
                    <p className="truncate text-sm font-medium">{user?.name ?? "Account"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <Link href="/dashboard/settings" className="block rounded-sm px-3 py-2 text-sm hover:bg-accent">
                    Profile & settings
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
