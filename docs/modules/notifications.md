# Notifications Module

In-app, email, and SMS notifications with read/unread tracking.

**Install:** `genesis add notifications`

**Package:** `@genesis/notifications`

**Depends on:** `@genesis/auth` (recommended)

## Configuration

```typescript
import notifications from "@genesis/notifications/config";

notifications({
  channels: ["in-app", "email"],
});
```

## Environment Variables

None required for in-app notifications. Email channel uses `@genesis/emails` when configured.

## Create a Notification (server)

```typescript
import { NotificationService } from "@genesis/notifications";
import { connectDatabase } from "@genesis/database";

await connectDatabase();
const notifications = new NotificationService();

await notifications.create({
  userId: "user_123",
  title: "Payment received",
  body: "Your payment of ₦5,000 was successful.",
  channel: "in-app",
});
```

## Notification Bell (client)

```tsx
import { NotificationBell } from "@genesis/notifications";

export function Header() {
  return (
    <header>
      <NotificationBell />
    </header>
  );
}
```

## API Routes (scaffolded)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/notifications?userId=...` | List notifications |
| `GET` | `/api/notifications?count=true&userId=...` | Unread count |
| `POST` | `/api/notifications` | Create notification |
| `PATCH` | `/api/notifications` | Mark as read |

## Notifications Page

Scaffolded at `/notifications` — full notification center with mark-as-read.

## Payment Success Example

```typescript
// After successful payment verification
await notifications.create({
  userId: transaction.userId,
  title: "Payment successful",
  body: `Your payment of ₦${transaction.amount} was confirmed.`,
  channel: "in-app",
});
```

## See Also

- [Payments module](payments.md)
- [Emails module](emails.md)
