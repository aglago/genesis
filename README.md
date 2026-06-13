# Genesis

**Modular project starter & component ecosystem** — assemble production-ready web applications from reusable modules instead of rebuilding the same features every time.

## Vision

Enable developers to create production-ready web applications in minutes by assembling reusable modules:

- Authentication
- Payments
- Notifications
- Email systems
- Admin dashboards
- Branding systems
- File uploads

## Quick Start

```bash
# From the Genesis monorepo (development)
npm install
npm run build

# Create a new project
node cli/dist/index.js create my-app

# Or after publishing
npx @genesis/cli create my-app
```

The CLI will prompt for:

1. Project name
2. Template (blank, informational site, SaaS, e-commerce)
3. Modules to install

Then it scaffolds a Next.js app, installs `@genesis/*` packages, copies route files, and merges environment variables.

**See [docs/quickstart.md](docs/quickstart.md) for detailed examples**, or browse the full [documentation](docs/README.md).

## CLI Commands

| Command | Description |
|---------|-------------|
| `genesis create [name]` | Create a new project with selected modules |
| `genesis create -s monorepo` | Create a Turborepo project with `apps/web` |
| `genesis add <module>` | Add a module to an existing project |
| `genesis remove <module>` | Remove a module and its scaffolded files |
| `genesis update` | Update `@genesis/*` packages |

## Available Modules

| Module | Phase | Description |
|--------|-------|-------------|
| `@genesis/auth` | 1 | Registration, login, JWT, RBAC |
| `@genesis/branding` | 1 | Logo, colors, typography |
| `@genesis/payments` | 1 | Paystack payments & webhooks |
| `@genesis/dashboard` | 1 | Admin sidebar, tables, settings |
| `@genesis/emails` | 2 | Transactional email (Resend/SendGrid) |
| `@genesis/notifications` | 2 | In-app, email, SMS notifications |
| `@genesis/uploads` | 2 | Cloudinary/S3 file uploads |
| `@genesis/analytics` | 3 | Event tracking & dashboard metrics |

## Architecture

Genesis uses a **hybrid module model**:

- **`@genesis/*` packages** — shared logic, components, hooks, server utilities
- **CLI scaffolding** — app-specific routes, middleware, env templates copied into your project

Each module includes a `manifest.json` declaring dependencies, env vars, and scaffold files.

```typescript
// genesis.config.ts
import { defineGenesisConfig } from "@genesis/core";
import auth from "@genesis/auth/config";
import branding from "@genesis/branding/config";

export default defineGenesisConfig({
  modules: [
    auth({ providers: ["email"] }),
    branding({ primaryColor: "#000000" }),
  ],
});
```

## Monorepo Structure

```
genesis/
├── cli/                  # @genesis/cli
├── packages/
│   ├── core/             # Config, registry, shared utils
│   ├── database/         # MongoDB adapter
│   ├── ui/               # Shared UI components
│   ├── auth/             # Authentication module
│   ├── branding/         # Branding module
│   ├── payments/         # Payments module
│   ├── dashboard/        # Dashboard module
│   ├── emails/           # Email module
│   ├── notifications/    # Notifications module
│   ├── uploads/          # Uploads module
│   └── analytics/        # Analytics module
└── templates/            # Project templates
```

## Documentation

| Guide | Description |
|-------|-------------|
| [docs/quickstart.md](docs/quickstart.md) | Install and create your first project |
| [docs/cli.md](docs/cli.md) | CLI commands reference |
| [docs/configuration.md](docs/configuration.md) | Env vars and `genesis.config.ts` |
| [docs/templates.md](docs/templates.md) | Template reference and project structure |
| [docs/workflows.md](docs/workflows.md) | Common project setups |
| [docs/modules/](docs/modules/) | Per-module usage guides |
| [docs/agent-skill.md](docs/agent-skill.md) | Install the Genesis AI agent skill |
| [USAGE.md](USAGE.md) | Documentation index |

## Development

```bash
npm install
npm run build      # Build all packages
npm run test       # Run tests
npm run typecheck  # Type check
```

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB (PostgreSQL planned)
- **Monorepo:** Turborepo + npm workspaces
- **Distribution:** GitHub Packages (private), npm (public phase)

## License

MIT — see [LICENSE](LICENSE)
