"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@genesis/ui";
import { isDashboardNavActive } from "@genesis/dashboard";
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

function PanelIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function NavIcon({ href, className }: { href: string; className?: string }) {
  const icons: Record<string, ReactNode> = {
    "/dashboard": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
    "/dashboard/orders": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    "/dashboard/users": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    "/dashboard/settings": (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  };

  return icons[href] ?? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
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
  const [collapsed, setCollapsed] = useState(false);
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
      <div className={cn("flex h-14 items-center border-b", collapsed ? "justify-center px-2" : "justify-between px-4")}>
        {!collapsed && (
          <Link href="/dashboard" className="truncate font-semibold tracking-tight">
            {config.title}
          </Link>
        )}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-8 w-8 items-center justify-center rounded-md border hover:bg-accent md:inline-flex"
          onClick={() => setCollapsed((value) => !value)}
        >
          <PanelIcon className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-auto p-2">
        {config.navItems.map((item) => {
          const active = isDashboardNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
                active && "bg-accent text-accent-foreground",
              )}
            >
              <NavIcon href={item.href} className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t p-3", collapsed && "flex justify-center")}>
        {!collapsed && (
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? "Admin"}</p>
        )}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
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
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card text-card-foreground transition-[width,transform] duration-200 md:static md:translate-x-0",
          collapsed ? "w-[4.5rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
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
                  {(user?.name ?? user?.email ?? "A").charAt(0).toUpperCase()}
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
