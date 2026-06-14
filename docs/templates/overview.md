# What is a Genesis template?

A Genesis template is a **curated starter** — not a turnkey product.

Every project includes **branding** (`@genesis/branding`) — logo, colors, fonts, and app name via CSS variables. Named templates bundle additional modules; the blank template always includes branding and lets you pick the rest.

When you run `genesis create -t saas-app`, you get:

1. A **base Next.js app** (App Router, TypeScript, Tailwind, dark mode)
2. A **template landing page** (hero, sample content)
3. **Selected modules** installed and wired (`@genesis/auth`, `@genesis/payments`, etc.)
4. **Scaffolded routes and API handlers** from those modules (login, dashboard, webhooks)
5. **`genesis.config.ts`** and **`.env.example`** merged for your choices

You do **not** get a production-ready SaaS with billing plans, teams, onboarding flows, email campaigns, or polished marketing copy. You get the **foundation** those features plug into.

---

## Starter vs complete app

| Genesis gives you | You still build |
|-------------------|-----------------|
| Register / login / JWT auth | OAuth providers, SSO, org/team models |
| Paystack initialize + webhook stubs | Pricing pages, subscriptions, invoices, dunning |
| Admin dashboard shell + sample stats | Real metrics, charts, CRUD for your domain |
| Notification API scaffold | Notification UI, preferences, delivery rules |
| Branding CSS variables | Final design system, illustrations, copy |
| Contact form + validation | Email delivery, CRM integration |

Think of Genesis like a **framework with batteries included** — the batteries are modules you can swap or extend, not a finished device.

---

## How scaffolding works

```
genesis create my-app -t saas-app
        │
        ├─► Base Next.js scaffold (all templates)
        ├─► Copy templates/saas-app/* (landing page, site header)
        ├─► Install bundled @genesis/* packages
        ├─► Copy module scaffolds (auth pages, dashboard, payment routes)
        ├─► Write genesis.config.ts
        └─► Merge .env.example
```

Template files live in the Genesis repo at `templates/<template-id>/`. They typically override the home page and add template-specific components. **Modules** add the rest (auth, dashboard, payments, etc.).

After creation, your project is a normal Next.js app. Edit pages, add routes, run `genesis add` for more modules.

---

## Dark mode and headers

Every project includes **dark mode** (system default + toggle):

| Area | Theme toggle location |
|------|------------------------|
| Marketing / landing pages | Site header (top right) |
| Auth pages (`/login`, `/register`) | Site header or fixed corner (blank template) |
| Dashboard (`/dashboard/*`) | Dashboard top bar (next to profile menu) |

The marketing header is **hidden on dashboard routes** so you don't get duplicate navigation.

---

## Continuing from a template

1. **Run locally** — `cp .env.example .env`, fill secrets, `npm run dev`
2. **Read your template guide** — [SaaS](saas-app.md), [Informational](informational-site.md), etc.
3. **Understand bundled modules** — [Modules explained](modules.md)
4. **Replace sample data** — landing copy, dashboard stats, product grid
5. **Wire integrations** — MongoDB, Paystack, Resend (see [Configuration](../configuration.md))
6. **Add modules** — `genesis add emails` when you need transactional mail
7. **Build your product** — domain models, business logic, UI polish

---

## See also

- [Templates index](../templates.md)
- [Modules explained](modules.md)
- [Base scaffold](base-scaffold.md)
