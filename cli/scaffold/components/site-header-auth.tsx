"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@genesis/ui";

interface SessionUser {
  email: string;
  name: string | null;
  role: string;
}

export function SiteHeaderAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authEnabled, setAuthEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => {
        if (res.status === 404) {
          setAuthEnabled(false);
          return { user: null };
        }
        setAuthEnabled(true);
        return res.ok ? res.json() : { user: null };
      })
      .then((data) => setUser(data.user ?? null))
      .catch(() => {
        setAuthEnabled(false);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!authEnabled) {
    return null;
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (loading) {
    return <div className="h-9 w-24" aria-hidden />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <span className="hidden max-w-[160px] truncate text-sm text-muted-foreground sm:inline">
          {user.name ?? user.email}
        </span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        Sign in
      </Link>
      <Link href="/register">
        <Button size="sm">Get started</Button>
      </Link>
    </div>
  );
}
