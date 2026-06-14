"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardDescription } from "@genesis/ui";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }

    setVerifyUrl(data.verifyUrl ?? null);
    setEmailSent(Boolean(data.emailSent));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              {emailSent
                ? `We sent a verification link to ${email}. Open it to activate your account.`
                : `Your account was created for ${email}. Verify your email before signing in.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {verifyUrl && (
              <div className="rounded-md border bg-muted/50 p-3 text-sm">
                <p className="font-medium">Local development</p>
                <p className="mt-1 text-muted-foreground">
                  Email is not configured yet (<code className="genesis-inline-code">RESEND_API_KEY</code> or{" "}
                  <code className="genesis-inline-code">SENDGRID_API_KEY</code>). Use this link to verify:
                </p>
                <a href={verifyUrl} className="mt-2 block break-all text-primary underline">
                  {verifyUrl}
                </a>
              </div>
            )}
            {!verifyUrl && emailSent && (
              <p className="text-sm text-muted-foreground">
                Did not receive it? Check spam or ask your admin to confirm email settings.
              </p>
            )}
            <Link href="/login" className="block">
              <Button className="w-full" variant={emailSent || verifyUrl ? "outline" : "default"}>
                Sign in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Create account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
