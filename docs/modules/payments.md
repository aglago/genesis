# Payments Module

Paystack payment initialization, verification, webhooks, and transaction history.

**Install:** `genesis add payments`

**Package:** `@genesis/payments`

## Configuration

```typescript
import payments from "@genesis/payments/config";

payments({
  provider: "paystack",
  currency: "NGN",
});
```

## Environment Variables

```env
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_WEBHOOK_SECRET=whsec_...
```

## Initialize a Payment (client)

Used by the e-commerce template **Buy now** button and any custom checkout UI:

```typescript
const res = await fetch("/api/payments/initialize", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "customer@example.com",
    amount: 5000, // in Naira (NGN)
    userId: "user_123", // or "guest" without auth
    metadata: { productId: "1", productName: "Product One" },
  }),
});

const { data } = await res.json();
window.location.href = data.authorization_url; // Redirect to Paystack
```

The default callback URL is `/payment/callback` on your app origin. After Paystack redirects back, that page calls verify and links to **Dashboard → Orders**.

## Verify After Redirect

Paystack redirects to `/payment/callback?reference=...` (scaffolded page). It calls:

```typescript
const reference = new URLSearchParams(window.location.search).get("reference");
const res = await fetch(`/api/payments/verify?reference=${reference}`);
const { result } = await res.json();
```

## Dashboard orders

When `@genesis/payments` is installed with `@genesis/dashboard`, Genesis scaffolds:

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview with live paid-order stats |
| `/dashboard/orders` | Transaction table (reference, product metadata, status) |

Adding `payments` to an existing project updates dashboard nav with an **Orders** link.

## Webhook

Scaffolded at `POST /api/webhooks/paystack`. Point your Paystack dashboard webhook URL to:

```
https://your-domain.com/api/webhooks/paystack
```

For local development, use [ngrok](https://ngrok.com) — see [Troubleshooting](../troubleshooting.md#paystack-webhook-not-firing-locally).

## PaymentService (server)

```typescript
import { PaystackClient, PaymentService } from "@genesis/payments";
import { connectDatabase } from "@genesis/database";

await connectDatabase();

const paystack = new PaystackClient(
  process.env.PAYSTACK_SECRET_KEY!,
  process.env.PAYSTACK_PUBLIC_KEY!,
);
const payments = new PaymentService(paystack);

const result = await payments.initialize("user_123", "customer@example.com", 5000, "NGN");
const history = await payments.getHistory("user_123");
```

## See Also

- [Configuration](../configuration.md)
- [Notifications module](notifications.md) — notify users on payment success
- [Workflows — SaaS / E-commerce](../workflows.md)
