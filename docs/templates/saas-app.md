# SaaS Starter template

**CLI ID:** `saas-app`  
**Label:** SaaS Starter `[auth, branding, payments, dashboard, notifications]`

The most feature-rich Genesis template. It wires **authentication, branding, Paystack payments, an admin dashboard, and notifications** — enough to register, verify email, sign in, and land in a dashboard shell.

It is a **SaaS starter**, not a complete SaaS product.

---

## What you get

### Marketing site

| Route | Description |
|-------|-------------|
| `/` | SaaS landing hero with Get Started / Sign In links |
| Site header | Auth-aware: Dashboard + Sign out when logged in; hidden on `/dashboard/*` |

### Auth (`@genesis/auth`)

| Route | Description |
|-------|-------------|
| `/register` | Create account |
| `/login` | Sign in (JWT httpOnly cookie) |
| `/forgot-password` | Request reset |
| `/verify-email?token=...` | Email verification |
| `POST /api/auth/register` | Registration API |
| `POST /api/auth/login` | Login API |
| `GET /api/auth/session` | Current user (for header/dashboard) |
| `POST /api/auth/logout` | Clear session |

**Email verification** is enabled. Without `@genesis/emails` or `RESEND_API_KEY`, dev mode shows a verification link on the register success screen.

### Dashboard (`@genesis/dashboard`)

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview with stat cards (placeholder data) |
| `/dashboard/users` | Sample users table |
| `/dashboard/settings` | Sample settings form |

Dashboard shell includes:

- Responsive sidebar (hamburger on mobile)
- Profile menu with sign out
- **Theme toggle** in the top bar (next to profile)
- Active nav highlighting

### Payments (`@genesis/payments`)

| Route | Description |
|-------|-------------|
| `POST /api/payments/initialize` | Start Paystack checkout |
| `POST /api/payments/verify` | Verify transaction |
| `POST /api/webhooks/paystack` | Paystack webhook handler |

No pricing page, subscription plans, or billing portal UI — API wiring only.

### Notifications (`@genesis/notifications`)

| Route | Description |
|-------|-------------|
| `GET/POST/PATCH /api/notifications` | Notification CRUD scaffold |

No in-app notification bell UI — extend yourself.

---

## Modules

| | Modules |
|--|---------|
| **Bundled** | `auth`, `branding`, `payments`, `dashboard`, `notifications` |
| **Optional add-ons** | `emails`, `uploads`, `analytics` |
| **Blocked** | None |

```bash
genesis create acme -y -t saas-app --local
```

---

## Environment variables

```env
JWT_SECRET=your-32-char-minimum-secret-key-here
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/your-app-name
MONGODB_DB_NAME=your-app-name
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=
```

Optional (recommended for production):

```env
RESEND_API_KEY=re_...          # verification & transactional email
EMAIL_FROM=noreply@yourdomain.com
```

**MongoDB must be running locally** for auth, payments, and notifications. Genesis does not start MongoDB for you.

---

## What this is NOT

| Expectation | Reality |
|-------------|---------|
| Full Stripe/Paystack billing UI | Initialize + webhook stubs only |
| Subscription tiers & proration | Build your own product/pricing models |
| Team / org / invite flows | Single-user auth scaffold |
| OAuth (Google, GitHub) | Email/password only |
| Production email | Opt-in via `emails` module + API keys |
| Notification center UI | API only |
| Middleware enabled by default | `middleware.genesis-auth.ts` provided — merge into `middleware.ts` to protect `/dashboard` |

---

## Recommended next steps

### 1. Local setup

```bash
genesis create acme -y -t saas-app --local
cd acme
cp .env.example .env
# Start MongoDB, set JWT_SECRET, Paystack test keys
npm install && npm run dev
```

### 2. Protect dashboard routes

Merge `middleware.genesis-auth.ts` into root `middleware.ts`:

```typescript
import { authMiddleware } from "./middleware.genesis-auth";

export function middleware(request: NextRequest) {
  return authMiddleware(request);
}

export const config = { matcher: ["/dashboard/:path*"] };
```

### 3. Enable email verification

```bash
genesis add emails
# Add RESEND_API_KEY to .env
```

Registration will send real verification emails (auth route checks `RESEND_API_KEY` automatically).

### 4. Build your product layer

| Goal | Suggested work |
|------|----------------|
| Pricing page | New `app/pricing/page.tsx` + Paystack plans |
| Subscriptions | Store plan on user doc; webhook updates status |
| Teams | New `organizations` collection; extend auth |
| Real dashboard metrics | `genesis add analytics`; replace `getDefaultStats()` |
| User management | Replace sample users table with MongoDB queries |
| Notification bell | Client component polling `/api/notifications` |

### 5. Customize branding

Edit `genesis.config.ts` branding options and landing copy in `app/page.tsx`.

---

## File map (after create)

```
app/
├── layout.tsx                    # BrandingProvider + SiteHeader
├── page.tsx                      # SaaS landing (template)
├── (auth)/login|register|...
├── (dashboard)/
│   ├── layout.tsx
│   └── dashboard/page.tsx|users|settings
└── api/
    ├── auth/...
    ├── payments/...
    ├── notifications/...
    └── webhooks/paystack/
components/
├── site-header.tsx               # Auth-aware marketing header
├── site-header-auth.tsx
├── dashboard-shell.tsx           # Sidebar, profile, theme toggle
└── genesis/branding-provider.tsx
middleware.genesis-auth.ts        # Merge to protect dashboard
genesis.config.ts
```

---

## Dark mode

| Page | Toggle location |
|------|-----------------|
| `/`, `/login`, `/register` | Site header |
| `/dashboard/*` | Dashboard top bar (right side, before profile avatar) |

---

## See also

- [What is a template?](overview.md)
- [Modules explained](modules.md)
- [Auth](../modules/auth.md) · [Payments](../modules/payments.md) · [Dashboard](../modules/dashboard.md)
- [Troubleshooting](../troubleshooting.md) — MongoDB, email verification, auth errors
- [Templates index](../templates.md)
