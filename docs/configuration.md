# Configuration

## Environment Variables

Copy the example file and fill in values:

```bash
cp .env.example .env
```

### Core (database-backed modules)

```env
MONGODB_URI=mongodb://localhost:27017/my-app
MONGODB_DB_NAME=my-app
```

### Auth

```env
JWT_SECRET=your-32-character-minimum-secret-key-here
JWT_EXPIRES_IN=7d
```

### Payments (Paystack)

```env
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_WEBHOOK_SECRET=whsec_...
```

### Emails (Resend)

```env
RESEND_API_KEY=re_...
```

### Uploads (Cloudinary)

```env
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## genesis.config.ts

Every project has a root `genesis.config.ts` that declares which modules are active and how they are configured.

### Minimal — branding only

```typescript
import { defineGenesisConfig } from "@genesis/core";
import branding from "@genesis/branding/config";

export default defineGenesisConfig({
  modules: [
    branding({
      primaryColor: "#2563eb",
      appName: "Acme Corp",
      logo: "/logo.svg",
    }),
  ],
});
```

### SaaS starter

```typescript
import { defineGenesisConfig } from "@genesis/core";
import auth from "@genesis/auth/config";
import branding from "@genesis/branding/config";
import payments from "@genesis/payments/config";
import dashboard from "@genesis/dashboard/config";

export default defineGenesisConfig({
  modules: [
    auth({
      providers: ["email"],
      requireEmailVerification: true,
    }),
    branding({
      primaryColor: "#000000",
      appName: "Acme SaaS",
    }),
    payments({
      provider: "paystack",
      currency: "NGN",
    }),
    dashboard({
      title: "Admin Panel",
    }),
  ],
});
```

### Full stack (all modules)

```typescript
import { defineGenesisConfig } from "@genesis/core";
import auth from "@genesis/auth/config";
import branding from "@genesis/branding/config";
import payments from "@genesis/payments/config";
import dashboard from "@genesis/dashboard/config";
import emails from "@genesis/emails/config";
import notifications from "@genesis/notifications/config";
import uploads from "@genesis/uploads/config";
import analytics from "@genesis/analytics/config";

export default defineGenesisConfig({
  modules: [
    auth({ providers: ["email"] }),
    branding({ primaryColor: "#6366f1", appName: "My App" }),
    payments({ provider: "paystack" }),
    dashboard({ title: "Dashboard" }),
    emails({ provider: "resend", fromEmail: "noreply@myapp.com" }),
    notifications({ channels: ["in-app", "email"] }),
    uploads({ provider: "cloudinary", maxFileSizeMB: 10 }),
    analytics({ trackPageViews: true }),
  ],
});
```

---

## See Also

- [Module docs](README.md#modules) — per-module config options and API usage
- [Troubleshooting](troubleshooting.md) — env-related errors
