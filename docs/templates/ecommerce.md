# E-commerce template

**CLI ID:** `ecommerce`  
**Label:** E-commerce `[payments, dashboard]`

A storefront **starting point** with a sample product grid, Paystack payment hooks, and an admin dashboard shell. Customer accounts and branding are optional add-ons.

---

## What you get

### Storefront

| Route | Description |
|-------|-------------|
| `/` | Product grid with sample products and “Add to Cart” buttons (UI only — no cart yet) |
| Site header | App name + theme toggle (no auth links until you add `auth`) |

### Admin (`@genesis/dashboard`)

Same dashboard shell as SaaS (sidebar, profile menu, theme toggle, responsive layout):

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview stat cards (placeholders) |
| `/dashboard/users` | Sample users table |
| `/dashboard/settings` | Sample settings form |

Without `auth`, profile menu still renders but session API may return no user until you add authentication.

### Payments (`@genesis/payments`)

| Route | Description |
|-------|-------------|
| `POST /api/payments/initialize` | Paystack checkout init |
| `POST /api/payments/verify` | Verify payment |
| `POST /api/webhooks/paystack` | Webhook handler |

---

## Modules

| | Modules |
|--|---------|
| **Bundled** | `payments`, `dashboard` |
| **Optional add-ons** | `auth`, `branding`, `uploads`, `notifications`, `analytics` |
| **Blocked** | None |

```bash
genesis create my-store -y -t ecommerce --local

# With customer accounts
genesis create my-store -y -t ecommerce -m auth --local
```

---

## Environment variables

```env
MONGODB_URI=mongodb://localhost:27017/my-store
MONGODB_DB_NAME=my-store
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=
```

Add when you install optional modules:

| Module | Vars |
|--------|------|
| `auth` | `JWT_SECRET`, `JWT_EXPIRES_IN` |
| `emails` | `RESEND_API_KEY` |
| `uploads` | Cloudinary or S3 credentials |

---

## What this is NOT

| Expectation | Reality |
|-------------|---------|
| Shopping cart & checkout flow | “Add to Cart” buttons are placeholders |
| Product catalog from database | Hardcoded sample products in `app/page.tsx` |
| Inventory management | Build your own admin CRUD |
| Shipping & tax | Not included |
| Customer login by default | Add `auth` module |
| Branded storefront | Add `branding` or customize CSS |

---

## Recommended next steps

### 1. Local setup

```bash
genesis create my-store -y -t ecommerce --local
cd my-store
cp .env.example .env
npm install && npm run dev
```

### 2. Add customer accounts (typical for stores)

```bash
genesis add auth
# Update site-header or use SaaS-style header for Sign in / Register
```

### 3. Add branding

```bash
genesis add branding
# Customize colors, logo in genesis.config.ts
```

### 4. Build commerce features

| Feature | Approach |
|---------|----------|
| Product model | MongoDB `products` collection; admin CRUD under `/dashboard/products` |
| Cart | Client state or server cart doc; `POST /api/cart` |
| Checkout | Wire “Buy” to `/api/payments/initialize` with cart total |
| Product images | `genesis add uploads` |
| Order notifications | `genesis add notifications` + webhook handlers |
| Real admin metrics | `genesis add analytics` |

### 5. Replace sample products

Edit `app/page.tsx` or fetch from your API:

```typescript
// Future: fetch from /api/products
const products = await getProducts();
```

---

## Comparison with SaaS template

| | E-commerce | SaaS Starter |
|--|------------|--------------|
| **Focus** | Storefront + payments | Auth + billing + dashboard |
| **Auth bundled** | No (optional) | Yes |
| **Landing page** | Product grid | SaaS hero |
| **Best if** | You're building a shop | You're building subscription software |

If you need auth + payments + dashboard from day one with a SaaS landing page, consider [`saas-app`](saas-app.md) instead.

---

## File map (after create)

```
app/
├── layout.tsx              # Root layout (branding if added)
├── page.tsx                # Product grid (template)
├── (dashboard)/...         # Admin shell
└── api/payments/...
components/
├── site-header.tsx
└── dashboard-shell.tsx     # Theme toggle in dashboard top bar
genesis.config.ts
```

---

## See also

- [Payments module](../modules/payments.md)
- [Dashboard module](../modules/dashboard.md)
- [SaaS template](saas-app.md) — if you need bundled auth
- [Templates index](../templates.md)
