# Modules explained

Genesis modules are installable packages (`@genesis/*`) that add **configuration**, **scaffolded routes**, and **server utilities** to your Next.js app. They are building blocks — not full features on their own.

Install at create time (bundled with a template) or later with `genesis add <module>`.

---

## Module reference

| Module | Package | What it adds | Requires |
|--------|---------|--------------|----------|
| **auth** | `@genesis/auth` | Register, login, JWT cookies, email verification, password reset, RBAC helpers | MongoDB, `JWT_SECRET` |
| **branding** | `@genesis/branding` | Logo, colors, fonts via CSS variables; `BrandingProvider` | — |
| **payments** | `@genesis/payments` | Paystack initialize/verify, webhook handler, transaction storage | MongoDB, Paystack keys |
| **dashboard** | `@genesis/dashboard` | Responsive admin shell (sidebar, profile menu), overview/users/settings pages | auth (recommended) |
| **notifications** | `@genesis/notifications` | In-app notification API + storage | MongoDB |
| **emails** | `@genesis/emails` | Resend/SendGrid transactional email helpers | API key |
| **uploads** | `@genesis/uploads` | Cloudinary/S3 upload helpers | Provider credentials |
| **analytics** | `@genesis/analytics` | Event tracking scaffold | MongoDB |

Deep dives: [auth](../modules/auth.md) · [branding](../modules/branding.md) · [payments](../modules/payments.md) · [dashboard](../modules/dashboard.md) · [emails](../modules/emails.md) · [notifications](../modules/notifications.md) · [uploads](../modules/uploads.md) · [analytics](../modules/analytics.md)

---

## What “installed” means

When a module is installed, Genesis:

1. Adds the npm package to `package.json`
2. Registers the module in `genesis.config.ts`
3. Copies **scaffold files** (pages, API routes, components) into your app
4. Merges **env vars** into `.env.example`

Example — **`auth`** scaffolds:

```
app/(auth)/login/page.tsx
app/(auth)/register/page.tsx
app/(auth)/forgot-password/page.tsx
app/(auth)/verify-email/page.tsx
app/api/auth/[...genesis]/route.ts
app/api/auth/session/route.ts
app/api/auth/logout/route.ts
middleware.genesis-auth.ts   ← merge into middleware.ts for route protection
```

Example — **`dashboard`** scaffolds:

```
components/dashboard-shell.tsx   ← sidebar, mobile nav, profile, theme toggle
app/(dashboard)/layout.tsx
app/(dashboard)/dashboard/page.tsx
app/(dashboard)/dashboard/users/page.tsx
app/(dashboard)/dashboard/settings/page.tsx
```

Scaffold code is **yours to edit** after creation. Genesis does not update your customizations on `genesis update` without your review.

---

## Module dependencies

Some modules expect others:

| Module | Soft dependency | Why |
|--------|-----------------|-----|
| dashboard | auth | Session API, profile menu, protected admin |
| payments | auth (typical) | Associate transactions with users |
| notifications | auth (typical) | Per-user notification lists |

Templates bundle modules that work together. Use **`custom`** if you need an unusual combination.

---

## Adding or removing later

```bash
genesis add emails          # adds package + scaffold + env vars
genesis remove analytics    # removes scaffold files (with confirmation)
genesis update              # bump @genesis/* versions
```

See [CLI Reference](../cli.md).

---

## See also

- [Templates index](../templates.md)
- [Configuration](../configuration.md)
