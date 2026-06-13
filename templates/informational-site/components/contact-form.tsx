"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@genesis/ui";

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to send message");
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border bg-muted/40 p-6 text-center">
        <p className="font-medium">Message sent</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <Button className="mt-4" variant="outline" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <Input
          id="name"
          placeholder="Your name"
          required
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="message">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="How can we help?"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
