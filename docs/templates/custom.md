# Blank (custom) template

**CLI ID:** `custom`  
**Label:** Blank (custom) `[pick modules]`

The blank template is for developers who want **full control** over which Genesis modules to install. No template-specific landing page — just the base Next.js home page and your module choices.

---

## What you get

### Included

- Base Next.js 15 scaffold ([details](base-scaffold.md))
- Dark mode + theme toggle (fixed top-right on the home page)
- Interactive **module picker** (unless you pass `-m` or `-y`)

### Not included

- No bundled modules (unless you select them)
- No template landing page or site header
- No opinionated navigation

---

## Modules

| | Modules |
|--|---------|
| **Bundled** | None — you choose |
| **Optional** | All modules available |
| **Blocked** | None |

```bash
genesis create my-app -t custom
# Interactive checkbox: auth, branding, payments, ...

genesis create my-app -t custom -m branding,auth -y
```

---

## Example home page

Generic placeholder:

- Project name
- “Built with Genesis” badge
- Theme toggle

Replace `app/page.tsx` with your own design.

---

## When to use

- Internal tools or admin panels with a custom shape
- Unusual module combinations (e.g. payments without dashboard)
- APIs or backends where you'll add UI later
- You already have a design system and just need Genesis modules

---

## What this is NOT

- Not a pre-designed marketing site
- Not a shortcut if you want SaaS defaults — use [`saas-app`](saas-app.md) instead

---

## Recommended next steps

1. Run the module picker thoughtfully — start small (`branding` only, or `auth` + `branding`)
2. Copy `.env.example` → `.env` and fill vars for installed modules
3. Replace `app/page.tsx` with your app entry point
4. Add `components/site-header.tsx` if you want marketing navigation
5. Run `genesis add <module>` as requirements grow

```bash
genesis create my-tool -t custom -m auth,dashboard -y --local
cp .env.example .env
npm install && npm run dev
```

---

## See also

- [Modules explained](modules.md)
- [Configuration](../configuration.md)
- [Templates index](../templates.md)
