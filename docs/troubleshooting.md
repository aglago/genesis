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

### Local development (unpublished packages)

Use `--local` when creating the project so dependencies point at the monorepo:

```bash
node cli/dist/index.js create my-app --local -y -t informational-site
```

Ensure Genesis packages are built first (`npm run build` from the monorepo root), then `npm install` in the new project.

### Published packages

If you created a project without `--local`, `npm install` expects packages on GitHub Packages. Either:

1. Recreate with `--local`, or
2. [Publish and configure `.npmrc`](publishing.md)

See [Publishing — local development](publishing.md#local-development-before-publishing).

---

## See Also

- [Quickstart](quickstart.md)
- [Configuration](configuration.md)
