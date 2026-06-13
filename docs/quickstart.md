# Quickstart

Get a Genesis project running in minutes.

## Installation

### Option A — From the Genesis monorepo (development)

Use this while Genesis is still private / unpublished:

```bash
git clone <your-genesis-repo>
cd genesis
npm install
npm run build
```

Create projects with the local CLI:

```bash
node cli/dist/index.js create my-app
```

### Option B — Published CLI (future)

Once `@genesis/cli` is published:

```bash
npx @genesis/cli create my-app
```

---

## Creating a Project

### Interactive (recommended for first-time use)

```bash
genesis create my-app
```

You will be prompted for:

1. **Project name** — e.g. `my-app`
2. **Project structure** — monolith (default) or Turborepo monorepo ([details](templates.md#project-structure-monolith-vs-monorepo))
3. **Template** — blank, informational site, SaaS, or e-commerce ([details](templates.md))
4. **Modules** — checkboxes for auth, branding, payments, etc.

Example session:

```
Project name: acme-saas
Project structure: Monolith — single Next.js app (recommended)
Select template: SaaS Starter
Select modules:
  [x] Authentication
  [x] Branding
  [x] Payments
  [x] Admin Dashboard
  [ ] Notifications
```

### Non-interactive (CI / scripts)

Skip prompts with flags:

```bash
# SaaS starter with default modules (auth, branding, payments, dashboard)
genesis create acme-saas -y -t saas-app

# Turborepo monorepo with apps/web
genesis create acme-saas -y -t saas-app --structure monorepo

# Blank project with specific modules
genesis create my-shop -t custom -m branding,payments,dashboard

# Informational landing page
genesis create my-site -y -t informational-site

# E-commerce starter
genesis create my-store -y -t ecommerce
```

| Flag | Description |
|------|-------------|
| `-y, --yes` | Use template defaults without prompts (structure defaults to monolith) |
| `-s, --structure <type>` | `monolith` (default) or `monorepo` — see [Templates](templates.md#project-structure-monolith-vs-monorepo) |
| `-t, --template <name>` | `custom`, `informational-site`, `saas-app`, `ecommerce` — see [Templates](templates.md) |
| `-m, --modules <list>` | Comma-separated module IDs, e.g. `auth,branding,payments` |

---

## After Creation

### Monolith (default)

```bash
cd my-app
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### Monorepo

```bash
cd my-app
cp apps/web/.env.example apps/web/.env
# Edit .env with your credentials
npm install
npm run dev    # runs turbo dev in apps/web
```

Open [http://localhost:3000](http://localhost:3000).

---

## Next Steps

- [Templates reference](templates.md) — what each template includes and default modules
- [Configure environment variables](configuration.md#environment-variables)
- [Set up genesis.config.ts](configuration.md#genesisconfigts)
- [Add or remove modules](cli.md)
- [Pick a workflow](workflows.md) for your use case
