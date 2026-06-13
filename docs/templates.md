# Templates

Genesis templates are starting points for `genesis create`. Each template layers pages and default module selections on top of a **base Next.js 15 app** (App Router, TypeScript, Tailwind).

Templates do **not** dictate project structure — choose **monolith** or **monorepo** separately when running `genesis create`. See [Project structure](#project-structure-monolith-vs-monorepo).

---

## Available Templates

| Template ID | CLI label | Best for | Bundled modules |
|-------------|-----------|----------|-----------------|
| `custom` | Blank (custom) | Full control — pick any modules yourself | *(none — you choose)* |
| `informational-site` | Informational Website | Landing pages, portfolios, marketing sites | `branding` |
| `saas-app` | SaaS Starter | Subscription products, B2B tools, apps with auth + billing | `auth`, `branding`, `payments`, `dashboard`, `notifications` |
| `ecommerce` | E-commerce | Online stores, product catalogs, checkout flows | `payments`, `dashboard` |

Named templates install their **bundled modules automatically**. You are not asked to pick auth on an informational site — that would break the template's purpose. Use **`custom`** for full module freedom, or answer **Yes** to "Customize modules?" to add optional extras.

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

**Modules:** Full picker — choose any combination.

**Home page:** Generic placeholder — project name + "Built with Genesis".

**When to use:**
- You know exactly which modules you need
- Internal tools, APIs, or non-standard app shapes
- Mixing modules that named templates would block

**Example:**
```bash
genesis create my-app -t custom
# Interactive module picker follows

genesis create my-app -t custom -m branding,auth
```

---

### `informational-site` — Informational Website

**Purpose:** Marketing and content sites without user accounts or payments.

**Bundled modules (automatic):** `branding`

**Optional add-ons (Customize modules?):** `emails`, `analytics`

**Blocked:** `auth`, `payments`, `dashboard`

**Template adds to `app/page.tsx`:**
- Hero section with headline and CTA
- Contact form section (`#contact`) using `@genesis/ui` Input, Button, and Textarea
- `POST /api/contact` route with validation (extend with `@genesis/emails` to deliver messages)

**When to use:**
- Portfolio, agency site, product landing page
- "Coming soon" or brochure sites
- Contact-only lead capture

**Example:**
```bash
genesis create my-portfolio -y -t informational-site
```

---

### `saas-app` — SaaS Starter

**Purpose:** Software-as-a-service products with user accounts, admin panel, payments, and notifications.

**Bundled modules (automatic):** `auth`, `branding`, `payments`, `dashboard`, `notifications`

**Optional add-ons (Customize modules?):** `emails`, `uploads`, `analytics`

**Template adds to `app/page.tsx`:**
- SaaS landing hero with Get Started / Sign In links

**Module scaffolds also add:**
- Auth pages, dashboard, payment API, Paystack webhook, notifications

**Example:**
```bash
genesis create acme -y -t saas-app
```

**Required env:** `MONGODB_URI`, `JWT_SECRET`, `PAYSTACK_*`

---

### `ecommerce` — E-commerce

**Purpose:** Online stores with product display, checkout, and admin.

**Bundled modules (automatic):** `payments`, `dashboard`

**Optional add-ons (Customize modules?):** `auth`, `branding`, `uploads`, `notifications`, `analytics`

**Template adds to `app/page.tsx`:**
- Product grid with sample products and Add to Cart placeholders

**Example:**
```bash
genesis create my-store -y -t ecommerce
```

---

## How Module Selection Works

| Template type | Module picker | Customize? |
|---------------|---------------|------------|
| `custom` | Always — pick any modules | N/A |
| Named templates | Bundled modules installed automatically | Optional — add vetted extras only |

**Interactive flow for named templates:**
1. Select template
2. CLI shows bundled modules: *"Includes: Branding"*
3. *"Customize modules for this template?"* — default **No**
4. If Yes: required modules are locked; optional add-ons can be checked; blocked modules are hidden

**Non-interactive (`-y`):** Bundled modules only. Override with `-m` — required modules are always included, excluded modules are filtered out.

```bash
# Informational — branding only (auth ignored even if passed)
genesis create site -y -t informational-site

# E-commerce + customer auth
genesis create shop -y -t ecommerce -m auth
# Installs: payments, dashboard, auth
```

---

## Bundled Modules by Template

| Template | Bundled (automatic) | Optional add-ons | Blocked |
|----------|---------------------|------------------|---------|
| `custom` | — | all | — |
| `informational-site` | branding | emails, analytics | auth, payments, dashboard |
| `saas-app` | auth, branding, payments, dashboard, notifications | emails, uploads, analytics | — |
| `ecommerce` | payments, dashboard | auth, branding, uploads, notifications, analytics | — |

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
| SaaS with auth + billing + admin + notifications | `saas-app` |
| Online store | `ecommerce` |
| Hand-picked modules or unusual combinations | `custom` |

---

## See Also

- [Quickstart](quickstart.md) — create commands and flags
- [Workflows](workflows.md) — step-by-step setup per use case
- [Configuration](configuration.md) — `genesis.config.ts` and env vars
- [CLI Reference](cli.md) — add/remove modules after creation
