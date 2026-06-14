"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@genesis/ui";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => setStatus(res.ok ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {status === "loading" && "Verifying email"}
            {status === "success" && "Email verified"}
            {status === "error" && "Verification failed"}
          </CardTitle>
          {status === "success" && (
            <CardDescription>Your account is active. You can sign in now.</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && <p className="text-muted-foreground">Please wait...</p>}
          {status === "error" && (
            <p className="text-muted-foreground">The link may be invalid or expired. Try registering again or contact support.</p>
          )}
          {status !== "loading" && (
            <Link href="/login" className="block">
              <Button className="w-full">{status === "success" ? "Sign in" : "Back to sign in"}</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
