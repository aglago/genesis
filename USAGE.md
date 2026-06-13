# Genesis Usage Guide

Documentation index for using Genesis. Detailed guides live in the [`docs/`](docs/) folder.

## Getting Started

| Guide | Description |
|-------|-------------|
| [docs/quickstart.md](docs/quickstart.md) | Install Genesis, create your first project |
| [docs/templates.md](docs/templates.md) | Templates, defaults, monolith vs monorepo |
| [docs/cli.md](docs/cli.md) | Add, remove, and update modules |
| [docs/configuration.md](docs/configuration.md) | Environment variables and `genesis.config.ts` |
| [docs/workflows.md](docs/workflows.md) | Portfolio, SaaS, e-commerce, incremental setups |
| [docs/troubleshooting.md](docs/troubleshooting.md) | Common errors and fixes |

## Modules

| Module | Guide |
|--------|-------|
| Authentication | [docs/modules/auth.md](docs/modules/auth.md) |
| Branding | [docs/modules/branding.md](docs/modules/branding.md) |
| Payments | [docs/modules/payments.md](docs/modules/payments.md) |
| Dashboard | [docs/modules/dashboard.md](docs/modules/dashboard.md) |
| Emails | [docs/modules/emails.md](docs/modules/emails.md) |
| Notifications | [docs/modules/notifications.md](docs/modules/notifications.md) |
| Uploads | [docs/modules/uploads.md](docs/modules/uploads.md) |
| Analytics | [docs/modules/analytics.md](docs/modules/analytics.md) |

## Quick Reference

```bash
# Create a project
genesis create my-app

# Non-interactive SaaS starter
genesis create acme -y -t saas-app

# Add a module to an existing project
genesis add notifications

# Remove a module
genesis remove payments

# Update all @genesis/* packages
genesis update
```

## See Also

- [README.md](README.md) — Project overview and architecture
- [docs/README.md](docs/README.md) — Full documentation index
- [docs/agent-skill.md](docs/agent-skill.md) — Install the Genesis AI agent skill
- [todo.md](todo.md) — Roadmap and implementation status
