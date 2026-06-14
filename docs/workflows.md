# Common Workflows

## 1. Portfolio / marketing site (no auth)

```bash
genesis create my-portfolio -y -t informational-site
cd my-portfolio
cp .env.example .env
npm install && npm run dev
```

**Includes:** landing page, contact form, branding module.

**Relevant docs:** [branding](modules/branding.md)

---

## 2. SaaS product

```bash
genesis create acme -y -t saas-app
cd acme
cp .env.example .env
# Set JWT_SECRET, MONGODB_URI, PAYSTACK keys
npm install && npm run dev
```

**Includes:** auth, branding, payments, dashboard, notifications.

**Typical user flow:**

1. User registers at `/register`
2. Verifies email at `/verify-email`
3. Signs in at `/login`
4. Makes a payment via Paystack
5. Admin manages users at `/dashboard/users`

**Relevant docs:** [auth](modules/auth.md), [payments](modules/payments.md), [dashboard](modules/dashboard.md)

---

## 3. E-commerce store

```bash
genesis create my-store -y -t ecommerce
cd my-store
cp .env.example .env
npm install && npm run dev
```

**Includes:** product listing with **Buy now** Paystack checkout, branding, payments, dashboard with **Orders** page.

**Typical test flow:**

1. Set Paystack test keys and MongoDB in `.env`
2. Open `/`, enter email, click **Buy now** on a product
3. Complete Paystack test checkout
4. Confirm order at `/dashboard/orders`

Add products by editing `app/page.tsx` or building product management on top of the dashboard.

**Relevant docs:** [payments](modules/payments.md), [dashboard](modules/dashboard.md)

---

## 4. Add features incrementally

Start minimal, grow over time:

```bash
genesis create my-app -t custom -m branding
cd my-app
npm install && npm run dev

# Later, when you need auth
genesis add auth

# Later, when you need payments
genesis add payments

# Later, admin panel
genesis add dashboard
```

See [CLI Reference](cli.md) for add/remove/update commands.

---

## Project Structure After Scaffolding

A SaaS project with auth, branding, payments, and dashboard looks like this:

```
my-app/
├── genesis.config.ts          # Module configuration
├── .env.example               # Required environment variables
├── middleware.genesis-auth.ts # Auth middleware snippet
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── users/page.tsx
│   │       └── settings/page.tsx
│   └── api/
│       ├── auth/[...genesis]/route.ts
│       ├── payments/
│       │   ├── initialize/route.ts
│       │   └── verify/route.ts
│       └── webhooks/paystack/route.ts
└── components/
    └── genesis/
        └── branding-provider.tsx
```
