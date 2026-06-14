# Templates

Genesis templates are **starting points**, not finished products. Each template scaffolds a Next.js 15 app, installs a sensible set of `@genesis/*` modules, and adds a few example pages so you can run locally and extend toward your real use case.

Templates do **not** ship a complete SaaS, store, or marketing site out of the box. They ship **wiring**: auth routes, payment stubs, dashboard shell, sample UI, and env/config you build on.

---

## Choose a template

| Template | CLI ID | Best for |
|----------|--------|----------|
| [Blank (custom)](templates/custom.md) | `custom` | Full control — pick any modules |
| [Informational Website](templates/informational-site.md) | `informational-site` | Landing pages, portfolios, contact forms |
| [SaaS Starter](templates/saas-app.md) | `saas-app` | Auth, billing hooks, admin dashboard |
| [E-commerce](templates/ecommerce.md) | `ecommerce` | Product catalog + payments + admin |

```bash
genesis create my-app -t saas-app --local
# CLI shows: SaaS Starter [auth, branding, payments, dashboard, notifications]
```

---

## Documentation

### Concepts (read first)

| Guide | Description |
|-------|-------------|
| [What is a template?](templates/overview.md) | Starter vs complete app, how scaffolding works |
| [Modules explained](templates/modules.md) | What each `@genesis/*` module provides |
| [Base scaffold](templates/base-scaffold.md) | Files every project gets regardless of template |
| [Project structure](templates/project-structure.md) | Monolith vs monorepo |

### Per-template guides

| Guide | Bundled modules |
|-------|-----------------|
| [Blank (custom)](templates/custom.md) | You choose |
| [Informational Website](templates/informational-site.md) | `branding` |
| [SaaS Starter](templates/saas-app.md) | `auth`, `branding`, `payments`, `dashboard`, `notifications` |
| [E-commerce](templates/ecommerce.md) | `payments`, `dashboard` |

---

## Quick comparison

| | Custom | Informational | SaaS | E-commerce |
|--|--------|---------------|------|------------|
| **Bundled modules** | — | branding | auth, branding, payments, dashboard, notifications | payments, dashboard |
| **Optional add-ons** | all | emails, analytics | emails, uploads, analytics | auth, branding, uploads, notifications, analytics |
| **Blocked modules** | — | auth, payments, dashboard | — | — |
| **Typical next step** | Add modules | Wire contact email, content | Subscriptions, teams, product UI | Catalog, cart, checkout |

---

## Module selection (CLI)

| Template type | Module picker | Customize? |
|---------------|---------------|------------|
| `custom` | Always — pick any modules | N/A |
| Named templates | Bundled modules installed automatically | Optional — add vetted extras only |

**Interactive flow for named templates:**

1. Select template (modules shown in brackets)
2. CLI shows bundled modules: *"Includes: Branding"*
3. *"Customize modules for this template?"* — default **No**
4. If Yes: required modules are locked; optional add-ons can be checked; blocked modules are hidden

**Non-interactive (`-y`):** Bundled modules only. Override with `-m` — required modules are always included, excluded modules are filtered out.

```bash
# Informational — branding only (auth ignored even if passed)
genesis create site -y -t informational-site

# E-commerce + customer accounts
genesis create shop -y -t ecommerce -m auth
```

---

## See also

- [Quickstart](quickstart.md) — install and first project
- [CLI Reference](cli.md) — `add`, `remove`, `update`
- [Configuration](configuration.md) — `genesis.config.ts` and env vars
- [Workflows](workflows.md) — step-by-step setups
- [Module guides](modules/auth.md) — deep dives per module
