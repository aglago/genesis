# Troubleshooting

## Application error: client-side exception (BrandingProvider)

**Symptom:** Next.js shows *Application error: a client-side exception has occurred* and the console mentions `Cannot read properties of undefined`.

**Cause:** The scaffolded `BrandingProvider` imported `genesis.config` on the client. That file is server-only and breaks in the browser.

**Fix:** Pass branding config from the **server** `app/layout.tsx` as a prop (the CLI does this automatically on new projects):

```tsx
import { BrandingProvider } from "@/components/genesis/branding-provider";
import genesisConfig from "../genesis.config";
import type { BrandingConfig } from "@genesis/branding";

const brandingConfig = (genesisConfig.modules.find((m) => m.id === "branding")?.options ?? {
  primaryColor: "#000000",
  logo: "/logo.svg",
  appName: "My App",
  fontFamily: "Inter, sans-serif",
}) as BrandingConfig;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BrandingProvider config={brandingConfig}>{children}</BrandingProvider>
      </body>
    </html>
  );
}
```

Or recreate the project with the latest CLI.

---

## Database not connected

**Symptom:** `500` on `/api/auth/register` or error: *Database not connected. Call connectDatabase() first.*

**Cause:** API routes must connect before using MongoDB-backed services. Older scaffolds instantiated `AuthService` at import time — recreate the project or update `@genesis/database` and the auth route scaffold.

Call `connectDatabase()` before using any module that reads/writes MongoDB:

```typescript
import { connectDatabase } from "@genesis/database";
await connectDatabase();
```

---

## MongoDB connection refused

**Symptom:** `503` or errors mentioning `ECONNREFUSED` / `MongoServerSelectionError`.

**Cause:** `mongodb://localhost:27017` only works when a **MongoDB server is running** on your machine. Genesis does not start MongoDB for you.

**Fix (macOS with Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Fix (Docker):**

```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

Then confirm `.env` matches your project database name (see `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/my-app
MONGODB_DB_NAME=my-app
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

Ensure Genesis packages are built first (`npm run build:packages` from the monorepo root), then `npm install` in the new project.

### Published packages

If you created a project without `--local`, `npm install` expects packages on GitHub Packages. Either:

1. Recreate with `--local`, or
2. [Publish and configure `.npmrc`](publishing.md)

See [Publishing — local development](publishing.md#local-development-before-publishing).

---

## See Also

- [Quickstart](quickstart.md)
- [Configuration](configuration.md)
