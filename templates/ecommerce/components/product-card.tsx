"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@genesis/ui";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  amount: number;
  stock: number;
}

export function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          amount: product.amount,
          userId: "guest",
          metadata: { productId: product.id, productName: product.name },
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.data?.authorization_url) {
        throw new Error(json.message || json.error || "Unable to start checkout");
      }

      window.location.href = json.data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <article className="flex h-full flex-col rounded-lg border bg-card p-6">
        <div className="aspect-[4/3] rounded-md bg-muted" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold">{product.name}</h2>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <p className="text-2xl font-bold">{product.priceLabel}</p>
          <p className="text-sm text-muted-foreground">{product.stock} left</p>
        </div>
        <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
          Buy now
        </Button>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              {product.name} · {product.priceLabel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor={`email-${product.id}`} className="text-sm font-medium">
              Email address
            </label>
            <Input
              id={`email-${product.id}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCheckout} disabled={loading}>
              {loading ? "Continuing…" : "Continue to payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
