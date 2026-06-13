# @genesis/payments

Paystack payment integration with initialization, verification, webhooks, and transaction history.

## Configuration

```typescript
payments({ provider: "paystack", currency: "NGN" })
```

## Environment Variables

- `PAYSTACK_SECRET_KEY` (required)
- `PAYSTACK_PUBLIC_KEY` (required)
- `PAYSTACK_WEBHOOK_SECRET` (optional)
