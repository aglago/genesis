# Genesis — Task Tracker

> Aligned with PRD MVP roadmap. Update status as work progresses.
> Legend: `[ ]` todo | `[~]` in progress | `[x]` done

## Phase 0 — Foundation

- [x] Init git + Turborepo monorepo
- [x] `@genesis/core` (config, registry, env helpers)
- [x] `@genesis/database` (MongoDB)
- [x] `@genesis/ui` (Tailwind + shadcn-style components)
- [x] CI/CD (lint, test, build, publish)

## Phase 1 — MVP

### CLI

- [x] `genesis create`
- [x] `genesis add`
- [x] `genesis remove`
- [x] `genesis update`

### Modules

- [x] `@genesis/auth`
- [x] `@genesis/branding`
- [x] `@genesis/payments` (Paystack)
- [x] `@genesis/dashboard`

### Validation

- [x] End-to-end dogfood (test-saas app)
- [x] README + module docs

## Phase 2 — Extended Modules

- [x] `@genesis/emails`
- [x] `@genesis/notifications`
- [x] `@genesis/uploads`
- [x] Cross-module integration tests

## Phase 3 — Templates & OSS

- [x] `informational-site` template
- [x] `saas-app` template
- [x] `ecommerce` template
- [x] `@genesis/analytics`
- [x] Open-source prep (LICENSE, npm publish workflow, docs)

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-13 | Hybrid module integration | Packages for shared logic + CLI scaffolds app routes/env |
| 2026-06-13 | MongoDB first | Per PRD §11; PostgreSQL adapter stubbed |
| 2026-06-13 | Paystack Phase 1 payments | Per PRD §6.2; Stripe/Flutterwave deferred |
| 2026-06-13 | Resend primary email provider | Per PRD §6.4; SendGrid as adapter |
| 2026-06-13 | `--structure monolith \| monorepo` | Default monolith; interactive prompt + `-s` flag for Turborepo `apps/web` |

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Project setup time | < 15 minutes | Pending dogfood validation |
| Code reuse | 70% across projects | Architecture in place |
| Architecture consistency | Same patterns everywhere | Module manifest contract enforced |
| Bug rate | Reduced vs repeated impl | Pending post-dogfood tracking |
