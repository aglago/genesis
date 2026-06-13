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

Create projects with the local CLI and **`--local`** so `@genesis/*` packages link from disk (no registry):

```bash
node cli/dist/index.js create my-app --local
```

Example with a template, no prompts:

```bash
node cli/dist/index.js create my-portfolio --local -y -t informational-site
cd my-portfolio
cp .env.example .env
npm install
npm run dev
```

### Option B — Published CLI

Once `@genesis/cli` is published to GitHub Packages:

1. Copy [`.npmrc.example`](../.npmrc.example) and set `GITHUB_TOKEN` (see [Publishing](publishing.md)).
2. Run:

```bash
npx @genesis/cli create my-app
cd my-app
cp .env.example .env
npm install
npm run dev
```

Full publish and tagging guide: [Publishing](publishing.md).

---

## Creating a Project

### Interactive (recommended for first-time use)

```bash
genesis create my-app
```

You will be prompted for:

1. **Project name** — e.g. `my-app`
2. **Project structure** — monolith (default) or Turborepo monorepo
3. **Template** — blank, informational site, SaaS, or e-commerce ([details](templates.md))
4. **Modules** — only for **`custom`** (full picker), or optional **Customize modules?** for named templates

Example session (informational site):

```
Project name: my-portfolio
Project structure: Monolith
Select template: Informational Website

  Marketing and content sites without user accounts or payments
  Includes: Branding

? Customize modules for this template? No
```

Example session (custom):

```
Project name: my-app
Select template: Blank (custom)
Select modules:
  [x] Authentication
  [x] Branding
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
| `-l, --local` | Link `@genesis/*` from the local monorepo (`file:` paths) — see [Publishing](publishing.md#local-development-before-publishing) |

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
