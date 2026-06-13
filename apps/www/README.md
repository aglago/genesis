# Genesis marketing site

Modern minimalist landing page for the Genesis project — docs, template previews, and getting started.

## Development

From the monorepo root:

```bash
npm install
npm run build --workspace=@genesis/ui
npm run dev:www
```

Open [http://localhost:3001](http://localhost:3001).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, template grid, docs teaser |
| `/templates` | Template previews with commands and feature lists |
| `/docs` | Documentation index |
| `/docs/[slug]` | Rendered markdown from `docs/` in the repo |

Docs are read from `../../docs` at build time — no duplicate content to maintain.
