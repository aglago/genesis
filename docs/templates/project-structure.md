# Project structure

When you run `genesis create`, you choose how the project is laid out. **Monolith is the default.**

Structure is independent of template — the same SaaS template works in either layout.

---

## Monolith (default)

Single Next.js app at the repo root. Best for MVPs, solo developers, and one deployable product.

```
my-app/
├── app/
├── components/
├── genesis.config.ts
├── package.json
└── .env.example
```

```bash
genesis create my-app
genesis create my-app -y -t saas-app
```

Run commands from the project root:

```bash
cd my-app
npm run dev
genesis add emails
```

---

## Monorepo

Turborepo workspace with `apps/web`. Best when you plan multiple apps or want workspace tooling from day one.

```
my-app/
├── apps/
│   └── web/               # Next.js app — genesis.config.ts lives here
│       ├── app/
│       ├── genesis.config.ts
│       └── package.json
├── package.json           # workspace root
└── turbo.json
```

```bash
genesis create my-app --structure monorepo
genesis create acme -y -t saas-app -s monorepo
```

Run from the **repository root**:

```bash
npm run dev
cp apps/web/.env.example apps/web/.env
```

The CLI detects `apps/web/genesis.config.ts` for `genesis add` / `remove` / `update`.

---

## Comparison

| | Monolith | Monorepo |
|--|----------|----------|
| **Default** | Yes | Opt in (`--structure monorepo`) |
| **genesis.config.ts** | Project root | `apps/web/` |
| **Best for** | MVPs, single product | Multi-app repos, agencies |
| **Modules** | `@genesis/*` in app `package.json` | Same — installed in `apps/web` |

---

## Genesis monorepo vs your monorepo

| | Your generated monorepo | Genesis toolkit repo |
|--|-------------------------|----------------------|
| **Purpose** | Your product | Developing `@genesis/*` packages |
| **Contains** | `apps/web` + your code | `packages/auth`, `cli/`, etc. |
| **Created by** | `genesis create --structure monorepo` | Clone the Genesis repository |

You can add your own `packages/` later — Genesis only scaffolds `apps/web` initially.

---

## See also

- [Templates index](../templates.md)
- [CLI Reference](../cli.md)
