# Genesis Reference

## Architecture

```
Consumer Next.js App                    Genesis Monorepo
─────────────────────                   ──────────────────
genesis.config.ts          ←──CLI──     cli/
app/api/... (scaffolded)   ←──copy──    packages/*/src/scaffold/
@genesis/* (npm deps)      ←──install── packages/*/
```

**Hybrid model:** packages export components, services, config factories; CLI copies route/page files into the consumer app.

## Monorepo Layout

```
genesis/
├── cli/                    @genesis/cli — bin: genesis
├── packages/
│   ├── core/               defineGenesisConfig, ModuleRegistry
│   ├── database/           MongoDB + BaseRepository
│   ├── ui/                 Shared Tailwind/shadcn-style components
│   ├── auth/               JWT auth, RBAC
│   ├── branding/           Theme, metadata
│   ├── payments/           Paystack
│   ├── dashboard/          Admin shell
│   ├── emails/             Resend/SendGrid
│   ├── notifications/      In-app notifications
│   ├── uploads/            Cloudinary
│   └── analytics/          Event tracking
└── templates/
    ├── custom/
    ├── informational-site/
    ├── saas-app/
    └── ecommerce/
```

## Module Contract

Every `@genesis/*` module MUST include:

| Artifact | Purpose |
|----------|---------|
| `src/index.ts` | Public exports (services, components, types) |
| `src/config.ts` | Zod schema + `defineModule()` factory, default export |
| `src/manifest.json` | CLI metadata (see schema below) |
| `src/scaffold/` | Files copied into consumer apps |
| `README.md` | Install, config, env, examples |
| `src/__tests__/` | Vitest unit tests |

### manifest.json Schema

```json
{
  "id": "auth",
  "name": "Authentication",
  "version": "0.1.0",
  "description": "...",
  "dependencies": ["auth"],
  "npmPackage": "@genesis/auth",
  "configImport": "@genesis/auth/config",
  "configFactory": "auth",
  "envVars": [
    { "key": "JWT_SECRET", "description": "...", "required": true, "example": "..." }
  ],
  "scaffoldFiles": [
    { "source": "scaffold/api-route.ts", "target": "app/api/auth/[...genesis]/route.ts" },
    { "source": "scaffold/optional.tsx", "target": "app/...", "optional": true }
  ]
}
```

- `dependencies`: other module IDs; CLI installs them first
- `configFactory`: function name used in generated `genesis.config.ts`
- `scaffoldFiles[].source`: relative to `src/scaffold/` (CLI strips `scaffold/` prefix)

### config.ts Pattern

```typescript
import { z } from "zod";
import { defineModule } from "@genesis/core";

export const myConfigSchema = z.object({
  option: z.string().default("value"),
});

export function myModule(options: Partial<z.infer<typeof myConfigSchema>> = {}) {
  return defineModule("myid", myConfigSchema.parse(options));
}

export default myModule;
```

### package.json exports

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./config": { "types": "./dist/config.d.ts", "import": "./dist/config.js" },
    "./manifest.json": "./src/manifest.json"
  }
}
```

## Module IDs and Packages

| ID | Package | Key env vars |
|----|---------|--------------|
| auth | @genesis/auth | JWT_SECRET, JWT_EXPIRES_IN |
| branding | @genesis/branding | — |
| payments | @genesis/payments | PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY |
| dashboard | @genesis/dashboard | — (depends auth) |
| emails | @genesis/emails | RESEND_API_KEY or SENDGRID_API_KEY |
| notifications | @genesis/notifications | — |
| uploads | @genesis/uploads | CLOUDINARY_* |
| analytics | @genesis/analytics | — (uses MongoDB) |

## Core APIs

```typescript
// Config
import { defineGenesisConfig, defineModule, resolveModuleOrder } from "@genesis/core";

// Registry (CLI)
import { initializeRegistry, getAllManifests } from "@genesis/core/registry";

// Database
import { connectDatabase, BaseRepository } from "@genesis/database";

// UI
import { Button, Card, Sidebar, cn } from "@genesis/ui";
```

## CLI Internals

| File | Role |
|------|------|
| `cli/src/commands/create.ts` | Scaffold Next.js + template + modules |
| `cli/src/commands/add.ts` | Install module + copy scaffold |
| `cli/src/commands/remove.ts` | Remove scaffold + update config |
| `cli/src/commands/update.ts` | npm update @genesis/* |
| `cli/src/utils/manifests.ts` | Load manifests from `packages/*/src/manifest.json` |
| `cli/src/utils/scaffold.ts` | Copy files, merge .env.example, write genesis.config.ts |
| `cli/src/utils/template.ts` | Next.js base scaffold + template merge |

Manifest loader path: `packages/<id>/src/manifest.json` (relative to monorepo root).

## Consumer App Structure (SaaS example)

```
my-app/
├── genesis.config.ts
├── .env.example
├── middleware.genesis-auth.ts   → merge into middleware.ts
├── app/
│   ├── (auth)/login|register|...
│   ├── (dashboard)/dashboard/...
│   └── api/auth|payments|webhooks/...
└── components/genesis/branding-provider.tsx
```

## Building New Modules — Checklist

1. Create `packages/<id>/` with package.json, tsconfig, vitest
2. Implement `config.ts`, `index.ts`, `manifest.json`
3. Add `src/scaffold/` files for consumer routes/pages
4. Add tests in `src/__tests__/`
5. Add `README.md` and `docs/modules/<id>.md`
6. CLI auto-discovers manifest — no registry edit needed
7. Run `npm run build && npm run test` from root

## Tech Stack Constraints

- Next.js 15 App Router, TypeScript, Tailwind CSS
- MongoDB via `@genesis/database` (PostgreSQL stub only)
- Paystack only for payments Phase 1
- Resend primary for emails
- Cloudinary primary for uploads
- Turborepo + npm workspaces

## Out of Scope (unless user explicitly requests)

- Stripe, Flutterwave, PostgreSQL production adapter
- SMS notifications (stub only)
- S3 uploads (stub only)
- Visual builder / low-code / hosting platform
