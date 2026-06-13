# Templates

Genesis templates are starting points for `genesis create`. Each template layers pages and default module selections on top of a **base Next.js 15 app** (App Router, TypeScript, Tailwind).

Templates do **not** dictate project structure — choose **monolith** or **monorepo** separately when running `genesis create`. See [Project structure](#project-structure-monolith-vs-monorepo).

---

## Available Templates

| Template ID | CLI label | Best for |
|-------------|-----------|----------|
| `custom` | Blank (custom) | Full control — pick modules yourself, minimal starting page |
| `informational-site` | Informational Website | Landing pages, portfolios, marketing sites |
| `saas-app` | SaaS Starter | Subscription products, B2B tools, apps with auth + billing |
| `ecommerce` | E-commerce | Online stores, product catalogs, checkout flows |

---

## What Every Project Gets (base scaffold)

Regardless of template, `genesis create` always scaffolds:

```
my-app/
├── package.json              # Next.js 15, React 19, @genesis/core
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── genesis.config.ts         # Populated from selected modules
├── .env.example              # Merged from module env vars
├── .gitignore
└── app/
    ├── layout.tsx            # Root layout
    ├── page.tsx              # Home page (overwritten by template if applicable)
    └── globals.css           # Tailwind + CSS variables
```

Selected modules then add routes, API handlers, components, and env vars on top of this base.

---

## Template Details

### `custom` — Blank

**Purpose:** Start from a clean slate. No template-specific pages — only the base Next.js home page.

**Default modules:** None (you choose at the prompt or via `-m`).

**Home page:** Generic placeholder — project name + "Built with Genesis".

**When to use:**
- You know exactly which modules you need
- Internal tools, APIs, or non-standard app shapes
- Incremental setup (`genesis add` over time)

**Example:**
```bash
genesis create my-app -t custom -m branding,auth
```

---

### `informational-site` — Informational Website

**Purpose:** Marketing and content sites without user accounts or payments.

**Default modules:** `branding`

**Template adds:** Replaces `app/page.tsx` with:
- Hero section with headline and CTA
- Contact form section (`#contact`)

**Does not include:** Auth, payments, dashboard, or admin features.

**When to use:**
- Portfolio, agency site, product landing page
- "Coming soon" or brochure sites
- Contact-only lead capture

**Example:**
```bash
genesis create my-portfolio -y -t informational-site
```

**Typical next steps:** Customize copy in `app/page.tsx`, set branding colors in `genesis.config.ts`, add logo to `public/`.

---

### `saas-app` — SaaS Starter

**Purpose:** Software-as-a-service products with user accounts, admin panel, and payments.

**Default modules:** `auth`, `branding`, `payments`, `dashboard`

**Template adds:** Replaces `app/page.tsx` with:
- SaaS landing hero
- "Get Started" → `/register`
- "Sign In" → `/login`

**Module scaffolds also add:**
- Auth pages: `/login`, `/register`, `/forgot-password`, `/verify-email`
- Dashboard: `/dashboard`, `/dashboard/users`, `/dashboard/settings`
- API: auth, payment init/verify, Paystack webhook

**When to use:**
- B2B/B2C SaaS with subscriptions or one-time payments
- Apps needing login, admin, and Paystack billing
- MVPs you want to ship quickly

**Example:**
```bash
genesis create acme -y -t saas-app
```

**Required env:** `MONGODB_URI`, `JWT_SECRET`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`

**Typical user flow:**
1. Register → verify email → sign in
2. Pay via Paystack
3. Admin manages users at `/dashboard/users`

---

### `ecommerce` — E-commerce

**Purpose:** Online stores with product display, checkout, and admin.

**Default modules:** `payments`, `dashboard`

**Template adds:** Replaces `app/page.tsx` with:
- Product grid (sample products with price and stock)
- "Add to Cart" buttons (placeholder — wire to your cart logic)

**Does not include by default:** Auth, branding (add with `genesis add` if needed).

**Module scaffolds also add:**
- Payment API routes and Paystack webhook
- Dashboard admin shell

**When to use:**
- Product catalogs and checkout
- Stores where admin manages inventory via dashboard
- Paystack-based payments (NGN default)

**Example:**
```bash
genesis create my-store -y -t ecommerce
```

**Typical next steps:** Replace sample products, add `genesis add auth` for customer accounts, add `genesis add branding` for theming.

---

## Default Modules by Template

| Template | Pre-selected modules |
|----------|---------------------|
| `custom` | *(none)* |
| `informational-site` | branding |
| `saas-app` | auth, branding, payments, dashboard |
| `ecommerce` | payments, dashboard |

In interactive mode you can change module checkboxes after picking a template. In non-interactive mode (`-y`), template defaults apply unless you override with `-m`:

```bash
# SaaS defaults
genesis create acme -y -t saas-app

# E-commerce template but add auth
genesis create shop -t ecommerce -m auth,payments,dashboard
```

---

## How Templates Work Internally

1. CLI scaffolds the **base Next.js app**
2. CLI copies files from `templates/<template-id>/` into the project (merges, does not wipe)
3. CLI installs selected `@genesis/*` packages and copies **module scaffolds** (routes, pages, API)
4. CLI writes `genesis.config.ts` and merges `.env.example`

Template files live in the Genesis monorepo at `templates/<template-id>/`. Currently each template only overrides `app/page.tsx`; modules add everything else.

---

## Project Structure: Monolith vs Monorepo

When you run `genesis create`, you choose how the project is laid out. **Monolith is the default.**

### Monolith (default)

Single Next.js app — best for MVPs, solo developers, and one deployable product.

```
my-app/
├── app/
├── genesis.config.ts
├── package.json           # @genesis/* deps + Next.js
└── .env.example
```

```bash
genesis create my-app                    # interactive — pick "Monolith"
genesis create my-app -y -t saas-app     # non-interactive default
```

### Monorepo

Turborepo with `apps/web` — best when you plan multiple apps or want workspace tooling from day one.

```
my-app/
├── apps/
│   └── web/               # Next.js app (genesis.config.ts lives here)
│       ├── app/
│       ├── genesis.config.ts
│       └── package.json
├── package.json           # workspace root + turbo scripts
└── turbo.json
```

```bash
genesis create my-app --structure monorepo
genesis create acme -y -t saas-app -s monorepo
```

Run `npm run dev` from the **repository root** — Turbo runs the web app. Use `cp apps/web/.env.example apps/web/.env`.

### Comparison

| | Monolith | Monorepo |
|--|----------|----------|
| **Default** | Yes | No — opt in |
| **Layout** | Single Next.js app at repo root | `apps/web` + Turborepo root |
| **genesis.config.ts** | Project root | `apps/web/` |
| **CLI flag** | `--structure monolith` (default) | `--structure monorepo` |
| **Best for** | MVPs, single product | Agencies, future multi-app repos |
| **Modules** | `@genesis/*` npm packages | Same — packages install in `apps/web` |

### add / remove / update in a monorepo

Run commands from the **repo root** or from `apps/web` — the CLI detects `apps/web/genesis.config.ts` automatically.

```bash
cd my-app
genesis add notifications

# or
cd apps/web
genesis add notifications
```

### Genesis monorepo vs your monorepo

| | Your generated monorepo | Genesis toolkit repo |
|--|-------------------------|----------------------|
| **Purpose** | Your product | Developing `@genesis/*` packages |
| **Contains** | `apps/web` + your code | `packages/auth`, `cli/`, etc. |
| **Created by** | `genesis create --structure monorepo` | Clone the Genesis repository |

You can add your own `packages/` later (e.g. `packages/shared-ui`) — Genesis only scaffolds `apps/web` initially.

---

## Choosing the Right Template

| Your goal | Template |
|-----------|----------|
| Landing page, no login | `informational-site` |
| SaaS with auth + billing + admin | `saas-app` |
| Online store | `ecommerce` |
| API-only, custom stack, or hand-picked modules | `custom` |
| SaaS + notifications from day one | `saas-app` then `genesis add notifications`, or `custom -m auth,branding,payments,dashboard,notifications` |

---

## See Also

- [Quickstart](quickstart.md) — create commands and flags
- [Workflows](workflows.md) — step-by-step setup per use case
- [Configuration](configuration.md) — `genesis.config.ts` and env vars
- [CLI Reference](cli.md) — add/remove modules after creation
