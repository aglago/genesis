---
name: genesis
description: >-
  Build and extend Genesis modular Next.js projects — CLI scaffolding, @genesis/*
  modules, genesis.config.ts, and the hybrid package+codegen pattern. Use when
  working with Genesis, @genesis/* packages, genesis create/add/remove/update,
  module manifests, Turborepo packages in the genesis monorepo, or assembling
  auth, payments, dashboard, branding, emails, notifications, uploads, analytics.
---

# Genesis Agent Skill

Genesis is a **hybrid modular starter**: shared logic in `@genesis/*` npm packages, app-specific routes/env wired via CLI scaffolding.

## Detect Context

| Context | Signals | Agent focus |
|---------|---------|-------------|
| **Monorepo** | `packages/auth/`, `cli/`, `turbo.json` | Edit packages, manifests, scaffolds, CLI |
| **Consumer app** | `genesis.config.ts`, scaffolded `app/api/` | Configure modules, customize scaffolds, env |
| **Greenfield** | User wants new app | Run CLI, pick template + modules |

## CLI Quick Reference

```bash
# Create (interactive) — name → structure → template → modules
genesis create my-app

# Create (non-interactive)
genesis create acme -y -t saas-app
genesis create acme -y -t saas-app --structure monorepo

# Manage modules (run inside project root or apps/web for monorepo)
genesis add notifications
genesis remove payments
genesis update
```

| Structure | Flag | Layout |
|-----------|------|--------|
| Monolith (default) | `--structure monolith` | Next.js app at repo root |
| Monorepo | `--structure monorepo` | Turborepo, app in `apps/web/` |

| Template | Bundled modules | Module selection |
|----------|-----------------|------------------|
| `custom` | branding | Full picker; branding always included |
| `informational-site` | branding | Auto; Customize? for emails/analytics. Blocks auth, payments, dashboard |
| `saas-app` | auth, branding, payments, dashboard, notifications | Auto; Customize? for emails, uploads, analytics |
| `ecommerce` | payments, dashboard, branding | Auto; Customize? for auth, uploads, etc. Buy now + Orders UI |

**Monorepo dev CLI:** `node cli/dist/index.js create my-app` (after `npm run build` at repo root)

## genesis.config.ts Pattern

Always use `defineGenesisConfig` + module config factories:

```typescript
import { defineGenesisConfig } from "@genesis/core";
import auth from "@genesis/auth/config";
import branding from "@genesis/branding/config";

export default defineGenesisConfig({
  modules: [
    auth({ providers: ["email"], requireEmailVerification: true }),
    branding({ primaryColor: "#2563eb", appName: "My App" }),
  ],
});
```

When adding a module via CLI, `genesis.config.ts` and `.env.example` are updated automatically. Manual edits must import from `@genesis/<module>/config`.

## Required Env (common)

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=genesis
JWT_SECRET=minimum-32-character-secret-key-here
JWT_EXPIRES_IN=7d
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
RESEND_API_KEY=re_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Call `connectDatabase()` from `@genesis/database` before any MongoDB-backed service in API routes.

## Module Dependency Order

Respect dependencies when adding modules manually:

- `dashboard` → requires `auth`
- `notifications` → recommended `auth`
- `emails` → often paired with `auth` (verification/reset)

CLI `genesis add` resolves and installs dependencies automatically.

## Agent Workflows

### Create a new consumer project

1. Choose template from user goal (SaaS → `saas-app`, landing → `informational-site`)
2. Run `genesis create <name> -y -t <template>` or interactive
3. Remind user: `cp .env.example .env`, fill secrets, `npm install && npm run dev`
4. Point to `docs/modules/<module>.md` for module-specific setup

### Add a feature to existing Genesis app

1. Check `genesis.config.ts` for installed modules
2. Run `genesis add <module>` — do not hand-copy scaffold files unless fixing a bug
3. Merge scaffolded middleware snippets (e.g. `middleware.genesis-auth.ts` → `middleware.ts`)
4. Add required env vars from module manifest

### Create or edit a @genesis module (monorepo)

Follow the module contract in [reference.md](reference.md):

```
packages/<id>/
├── src/index.ts       # Public API
├── src/config.ts      # Zod schema + defineModule factory
├── src/manifest.json  # CLI registry entry
├── src/scaffold/      # Files copied to consumer apps
├── README.md
└── src/__tests__/
```

After changes: `npm run build && npm run test` from repo root.

### Customize scaffolded pages

Scaffolded files live in the **consumer app** (full source ownership). Edit freely. Re-running `genesis add` skips existing files unless forced — warn before overwriting.

## Rules for Agents

1. **Prefer CLI over manual scaffolding** for install/remove/update
2. **Import from packages** (`@genesis/auth`, `@genesis/ui`) — don't duplicate module logic in consumer apps
3. **Never roll custom crypto** — use `@genesis/auth` JWT helpers
4. **Match existing conventions** — TypeScript strict, Zod env validation, Vitest tests
5. **Minimize scope** — one module per change when extending the monorepo
6. **Defer out-of-scope** — Stripe/Flutterwave, PostgreSQL, SMS, npm public publish unless explicitly requested

## Documentation Map

Read these when the task needs detail (progressive disclosure):

| Topic | File |
|-------|------|
| Module contract, manifest schema, monorepo layout | [reference.md](reference.md) |
| Agent task examples | [examples.md](examples.md) |
| User-facing quickstart | `docs/quickstart.md` |
| Templates (defaults, contents, monolith) | `docs/templates.md` |
| Per-module usage | `docs/modules/<module>.md` |
| Env + config examples | `docs/configuration.md` |
| Workflows (SaaS, e-commerce) | `docs/workflows.md` |
| Errors | `docs/troubleshooting.md` |

## Verification Checklist

Before marking Genesis work complete:

- [ ] `genesis.config.ts` imports match installed modules
- [ ] Required env vars documented or present in `.env.example`
- [ ] MongoDB-connected routes call `connectDatabase()`
- [ ] Module dependencies satisfied (`dashboard` + `auth`)
- [ ] Monorepo changes: `npm run build && npm run test` pass
- [ ] Consumer app: `npm run dev` starts without type errors
