# E-commerce template

**CLI ID:** `ecommerce`  
**Label:** E-commerce `[payments, dashboard, branding]`

A storefront **starting point** with sample products, **Buy now** Paystack checkout in **GHS (Ghana cedis)**, and a store-focused admin dashboard.

---

## What you get

### Storefront

| Route | Description |
|-------|-------------|
| `/` | Product grid with **Buy now** buttons wired to Paystack |
| `/payment/callback` | Verifies payment after Paystack redirect; links to Orders |
| Site header | App name + theme toggle (add `auth` for Sign in / Register) |

Each product card collects an email, calls `POST /api/payments/initialize`, and redirects to Paystack. Completed payments appear under **Dashboard → Orders**.

### Admin (`@genesis/dashboard`)

Shared **shell** (sidebar, profile menu, theme toggle) with **template-specific navigation**:

| Route | Description |
|-------|-------------|
| `/dashboard` | Live stats from Paystack transactions (paid count, revenue, pending) |
| `/dashboard/orders` | Table of all transactions with status and product metadata |
| `/dashboard/settings` | Sample settings form |

E-commerce uses **Store admin** nav: Overview, Orders, Settings — no sample Users page. SaaS keeps Users for account management.

### Payments (`@genesis/payments`)

| Route | Description |
|-------|-------------|
| `POST /api/payments/initialize` | Start Paystack checkout (used by Buy now) |
| `GET /api/payments/verify` | Verify payment after redirect |
| `POST /api/webhooks/paystack` | Webhook handler (updates order status) |

---

## Modules

| | Modules |
|--|---------|
| **Bundled** | `payments`, `dashboard`, `branding` |
| **Default currency** | `GHS` (cedis) — configured in `genesis.config.ts` |
| **Optional add-ons** | `auth`, `uploads`, `notifications`, `analytics`, `emails` |
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
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_WEBHOOK_SECRET=
```

Add when you install optional modules:

| Module | Vars |
|--------|------|
| `auth` | `JWT_SECRET`, `JWT_EXPIRES_IN` |
| `emails` | `RESEND_API_KEY` |
| `uploads` | Cloudinary or S3 credentials |

---

## Test the payment flow (UI)

1. Start MongoDB and fill Paystack **test** keys in `.env`
2. `npm run dev` and open `/`
3. Enter an email on a product and click **Buy now**
4. Complete checkout on Paystack (test card)
5. Land on `/payment/callback` → **View orders**
6. Open `/dashboard/orders` — the transaction should show as **Success**

For webhooks locally, tunnel with ngrok — see [Troubleshooting](../troubleshooting.md#paystack-webhook-not-firing-locally).

If `/payment/callback` cannot reach `api.paystack.co` (network timeout), Paystack may still show success in their UI. Check **Dashboard → Orders** — the webhook may have updated the order, or retry verify when your network allows outbound HTTPS.

---

## What this is NOT

| Expectation | Reality |
|-------------|---------|
| Shopping cart | Buy now only — one product per checkout |
| Product catalog from database | Hardcoded sample products in `app/page.tsx` |
| Inventory management | Build your own admin CRUD |
| Shipping & tax | Not included |
| Customer login by default | Add `auth` module |

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
# Site header can be updated for Sign in / Register
```

### 3. Build commerce features

| Feature | Approach |
|---------|----------|
| Product model | MongoDB `products` collection; admin CRUD under `/dashboard/products` |
| Cart | Client state or server cart doc; replace Buy now with Add to cart |
| Checkout | Sum cart total → `/api/payments/initialize` |
| Product images | `genesis add uploads` |
| Order notifications | `genesis add notifications` + webhook handlers |

### 4. Replace sample products

Edit `app/page.tsx` or fetch from your API:

```typescript
const products = await getProducts();
```

---

## Comparison with SaaS template

| | E-commerce | SaaS Starter |
|--|------------|--------------|
| **Focus** | Storefront + orders | Auth + billing + dashboard |
| **Auth bundled** | No (optional) | Yes |
| **Landing page** | Product grid + Buy now | SaaS hero |
| **Best if** | You're building a shop | You're building subscription software |

---

## File map (after create)

```
app/
├── layout.tsx              # BrandingProvider + site header
├── page.tsx                # Product grid (template)
├── payment/callback/       # Post-checkout verify page (@genesis/payments)
├── (dashboard)/dashboard/
│   ├── page.tsx            # Live payment stats (@genesis/payments)
│   └── orders/page.tsx     # Transaction table (@genesis/payments)
components/
├── product-card.tsx        # Buy now UI (template)
└── site-header.tsx
```

---

## See also

- [Payments module](../modules/payments.md)
- [Dashboard module](../modules/dashboard.md)
- [Modules explained](modules.md)
