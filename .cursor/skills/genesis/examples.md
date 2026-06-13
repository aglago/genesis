# Genesis Agent Examples

## Example 1: User wants a SaaS app with auth and payments

**User:** "Create a SaaS starter with login and Paystack payments"

**Agent actions:**
```bash
cd /path/to/genesis && npm run build
node cli/dist/index.js create acme-saas -y -t saas-app
cd acme-saas
cp .env.example .env
```

For Turborepo: add `--structure monorepo`, then `cp apps/web/.env.example apps/web/.env`.

Tell user to set `JWT_SECRET`, `MONGODB_URI`, `PAYSTACK_*` in `.env`, then `npm install && npm run dev`.

Routes available: `/register`, `/login`, `/dashboard`, payment API at `/api/payments/initialize`.

---

## Example 2: Add notifications to existing app

**User:** "Add in-app notifications to my Genesis project"

**Agent actions:**
1. Read `genesis.config.ts` — confirm project is Genesis
2. If `auth` missing and user needs user-scoped notifications, add auth first
3. ```bash
   genesis add notifications
   ```
4. Verify `genesis.config.ts` includes `notifications()`
5. Suggest adding `<NotificationBell />` to header — see `docs/modules/notifications.md`

---

## Example 3: Fix "Database not connected" in API route

**User:** "Auth register endpoint returns database error"

**Agent fix:**
```typescript
import { connectDatabase } from "@genesis/database";

export async function POST(request: Request) {
  await connectDatabase(); // Add this before AuthService usage
  // ...
}
```

Check `.env` has valid `MONGODB_URI`.

---

## Example 4: Create a new @genesis module in monorepo

**User:** "Add a blog module to Genesis"

**Agent workflow:**
1. Copy structure from `packages/branding/` (simplest reference)
2. Create `packages/blog/src/config.ts` with Zod schema
3. Create `manifest.json` with scaffold targets
4. Add `src/scaffold/` for any app routes
5. Export public API from `src/index.ts`
6. Add `docs/modules/blog.md`
7. Run `npm run build && npm run test`

Do NOT edit `cli/src/utils/manifests.ts` — CLI discovers manifests from filesystem.

---

## Example 5: Customize dashboard without breaking upgrades

**User:** "Add a Products page to the admin dashboard"

**Agent approach:**
1. Edit scaffolded `app/(dashboard)/dashboard/` — add `products/page.tsx`
2. Update nav in `genesis.config.ts`:
   ```typescript
   dashboard({
     title: "Admin",
     navItems: [
       { label: "Overview", href: "/dashboard" },
       { label: "Products", href: "/dashboard/products" },
       { label: "Users", href: "/dashboard/users" },
       { label: "Settings", href: "/dashboard/settings" },
     ],
   })
   ```
3. Use `@genesis/dashboard` `DashboardShell` and `@genesis/ui` components
4. Warn: `genesis add dashboard` re-run may skip existing files — manual merge if manifest changed

---

## Example 6: Wire auth emails after adding emails module

**User:** "Send verification email on registration"

**Agent approach:**
1. Ensure both modules: `genesis add auth` + `genesis add emails`
2. Set `RESEND_API_KEY` in `.env`
3. In scaffolded register handler or custom API route:
   ```typescript
   import { createEmailProvider, EmailService } from "@genesis/emails";

   const emails = new EmailService(
     createEmailProvider("resend", process.env.RESEND_API_KEY!, "noreply@app.com")
   );
   await emails.sendVerification(user.email, `${baseUrl}/verify-email?token=${token}`);
   ```

---

## Example 7: Monorepo PR checklist

When user submits changes to Genesis packages:

```bash
npm run build
npm run test
npm run typecheck
```

Verify changed module has: manifest.json, tests, README, docs/modules entry if user-facing.

---

## Example 8: User asks "what is Genesis?"

Brief answer: Modular Next.js starter — `@genesis/*` packages + CLI that scaffolds routes/config. Not a hosting platform or visual builder.

Point to: `docs/quickstart.md`, `genesis create my-app -y -t saas-app`
