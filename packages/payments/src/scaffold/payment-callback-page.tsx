"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CallbackState = "loading" | "success" | "failed" | "missing";

export default function PaymentCallbackPage() {
  const [state, setState] = useState<CallbackState>("loading");
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("reference");
    if (!ref) {
      setState("missing");
      return;
    }

    setReference(ref);

    fetch(`/api/payments/verify?reference=${encodeURIComponent(ref)}`)
      .then(async (res) => {
        const data = await res.json();

        if (res.ok) {
          const paid =
            data.result?.data?.status === "success" || data.transaction?.status === "success";
          setState(paid ? "success" : "failed");
          return;
        }

        setState("failed");
      })
      .catch(() => setState("failed"));
  }, []);

  const orderLabel = reference ? `#${reference.slice(-8).toUpperCase()}` : null;

  return (
    <main className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      {state === "loading" && (
        <>
          <h1 className="text-2xl font-bold">Processing your order…</h1>
          <p className="mt-2 text-muted-foreground">This will only take a moment.</p>
        </>
      )}

      {state === "success" && (
        <>
          <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Thank you!</h1>
          <p className="mt-2 text-muted-foreground">Your order is confirmed{orderLabel ? ` (${orderLabel})` : ""}.</p>
          <p className="mt-2 text-sm text-muted-foreground">We&apos;ll send a receipt to your email shortly.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue shopping
            </Link>
          </div>
        </>
      )}

      {(state === "failed" || state === "missing") && (
        <>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">
            {state === "missing"
              ? "We couldn't find your order details."
              : "We couldn't confirm your payment. If you were charged, please contact support with your order reference."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to shop
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
