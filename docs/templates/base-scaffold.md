# Base scaffold

Every `genesis create` run starts from the same **base Next.js 15 app**, regardless of template.

---

## Files created

```
my-app/
├── package.json              # Next.js 15, React 19, next-themes, @genesis/core
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── genesis.config.ts         # Populated after modules are chosen
├── .env.example              # Merged from module env vars
├── .gitignore
├── components/
│   ├── theme-provider.tsx    # Dark mode (next-themes)
│   └── theme-toggle.tsx      # Sun/moon toggle
└── app/
    ├── layout.tsx            # Root layout (updated when branding is installed)
    ├── page.tsx              # Home (overwritten by named templates)
    └── globals.css           # Tailwind + Genesis theme variables
```

---

## Always included

| Feature | Details |
|---------|---------|
| **App Router** | Next.js 15, TypeScript |
| **Tailwind CSS** | shadcn-style CSS variables (light + dark) |
| **Dark mode** | System default; toggle on marketing pages and dashboard |
| **@genesis/core** | Module registry and config helpers |
| **@genesis/ui** | Button, Input, Card, etc. (linked when modules need UI) |

---

## What templates add on top

| Layer | Source |
|-------|--------|
| Landing page design | `templates/<template-id>/app/page.tsx` |
| Site header (some templates) | `templates/<template-id>/components/site-header.tsx` |
| Module routes & APIs | `@genesis/*` package scaffolds |

---

## Local development defaults

With `--local`, `@genesis/*` packages link from the Genesis monorepo via `file:` paths. Build packages first:

```bash
cd genesis && npm run build:packages
cd my-app && npm install && npm run dev
```

MongoDB database name in `.env.example` defaults to your **project name** when templates include database modules.

---

## See also

- [Project structure](project-structure.md)
- [Templates index](../templates.md)
