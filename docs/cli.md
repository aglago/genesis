# CLI Reference

Run these commands **inside your generated project directory** (or from anywhere for `create`).

## Commands Overview

| Command | Description |
|---------|-------------|
| `genesis create [name]` | Create a new project with selected modules |
| `genesis add <module>` | Add a module to an existing project |
| `genesis remove <module>` | Remove a module and its scaffolded files |
| `genesis update` | Update `@genesis/*` packages to latest compatible versions |

For `create` options and examples, see [Quickstart](quickstart.md).

### create flags

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts (structure defaults to monolith) |
| `-s, --structure` | `monolith` or `monorepo` |
| `-t, --template` | Template ID — see [Templates](templates.md) |
| `-m, --modules` | Comma-separated module IDs |

---

## Add a Module

```bash
cd my-app
genesis add notifications
```

For monorepo projects, run from the repo root or `apps/web` — the CLI finds `genesis.config.ts` in either location.

Genesis will:

- Install `@genesis/notifications`
- Install any missing dependencies (e.g. `auth` for `dashboard`)
- Copy scaffold files (API routes, pages, components)
- Update `genesis.config.ts`
- Merge new env vars into `.env.example`

**Available module IDs:** `auth`, `branding`, `payments`, `dashboard`, `notifications`, `emails`, `uploads`, `analytics`

---

## Remove a Module

```bash
genesis remove payments
```

You will be asked to confirm before scaffolded files are deleted. Then uninstall the package:

```bash
npm uninstall @genesis/payments
```

---

## Update Modules

```bash
genesis update
```

Bumps all `@genesis/*` packages in your project to the latest compatible versions. Review scaffold diffs if routes changed between versions.

---

## See Also

- [Configuration](configuration.md) — env vars added by each module
- [Module docs](README.md#modules) — per-module usage after scaffolding
