# Troubleshooting

## Database not connected

Call `connectDatabase()` before using any module that reads/writes MongoDB:

```typescript
import { connectDatabase } from "@genesis/database";
await connectDatabase();
```

---

## JWT_SECRET must be at least 32 characters

Use a long random string in `.env`:

```env
JWT_SECRET=change-me-to-a-random-string-at-least-32-chars
```

See [Configuration — Auth](configuration.md#auth).

---

## Module already installed

```
Module auth is already installed.
```

Run `genesis remove auth` first if you want to re-scaffold it. See [CLI Reference](cli.md).

---

## Paystack webhook not firing locally

Use a tunnel (e.g. [ngrok](https://ngrok.com)) and set the webhook URL in your Paystack dashboard:

```bash
ngrok http 3000
# Use https://<id>.ngrok.io/api/webhooks/paystack
```

See [Payments module](modules/payments.md#webhook).

---

## @genesis/* packages not found after create

If you created the project from the Genesis monorepo, run `npm install` from the monorepo root so workspace links resolve. For standalone projects, ensure packages are published or linked locally.

---

## See Also

- [Quickstart](quickstart.md)
- [Configuration](configuration.md)
