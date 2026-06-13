"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@genesis/ui";

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
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          {status === "loading" && <p>Verifying your email...</p>}
          {status === "success" && <p>Email verified! You can now sign in.</p>}
          {status === "error" && <p>Verification failed. The link may be invalid or expired.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
