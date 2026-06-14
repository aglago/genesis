# Informational Website template

**CLI ID:** `informational-site`  
**Label:** Informational Website `[branding]`

A marketing-style landing page with contact form, branding, and dark mode. **No user accounts or payments** — by design.

---

## What you get

### Pages & routes

| Route | Description |
|-------|-------------|
| `/` | Hero, CTA, contact section (`#contact`) |
| `POST /api/contact` | Validates contact form (logs message; does not email by default) |

### UI

- Site header with app name, Contact link, theme toggle
- Contact form using `@genesis/ui` (Input, Button, Textarea)
- Card-wrapped contact section
- Branding CSS variables from `@genesis/branding`

### Not included

- User registration or login
- Payment or checkout
- Admin dashboard
- Email delivery (until you add `@genesis/emails`)
- CMS, blog, or multi-page content

---

## Modules

| | Modules |
|--|---------|
| **Bundled** | `branding` |
| **Optional add-ons** | `emails`, `analytics` |
| **Blocked** | `auth`, `payments`, `dashboard` |

Blocked modules cannot be added via the template customize flow — use [`custom`](custom.md) if you need auth on a marketing site.

```bash
genesis create my-portfolio -y -t informational-site --local
```

With email delivery:

```bash
genesis create my-portfolio -t informational-site
# Answer Yes to "Customize modules?" → check emails
# Or after creation: genesis add emails
```

---

## Environment variables

| Variable | When |
|----------|------|
| Branding options | In `genesis.config.ts` (colors, app name, logo path) |
| `RESEND_API_KEY` or `SENDGRID_API_KEY` | After adding `emails` module |
| MongoDB vars | Only if you add modules that use the database |

---

## What this is NOT

- Not a portfolio CMS — content is hardcoded in `app/page.tsx`
- Not a blog — add your own routes or a headless CMS
- Not a complete lead-gen pipeline — wire `/api/contact` to email or CRM yourself

---

## Recommended next steps

1. **Customize branding** — edit `genesis.config.ts` and `app/globals.branding.css`
2. **Update copy** — hero headline, contact section text in `app/page.tsx`
3. **Wire contact delivery** — `genesis add emails`, send from `/api/contact` using `@genesis/emails`
4. **Add analytics** — `genesis add analytics` for page/event tracking
5. **Add pages** — `/about`, `/pricing` as new routes under `app/`
6. **Deploy** — Vercel, etc.; set env vars in hosting dashboard

### Wire contact to email (sketch)

After `genesis add emails`:

```typescript
// app/api/contact/route.ts
import { createEmailProvider, EmailService } from "@genesis/emails";

const emails = new EmailService(
  createEmailProvider("resend", process.env.RESEND_API_KEY!, process.env.EMAIL_FROM!),
);

await emails.sendTemplate("you@company.com", "custom", {
  subject: `Contact from ${name}`,
  html: `<p>${message}</p><p>From: ${email}</p>`,
});
```

---

## File map (after create)

```
app/
├── layout.tsx              # BrandingProvider + SiteHeader
├── page.tsx                # Landing + contact (from template)
├── globals.branding.css
└── api/contact/route.ts
components/
├── site-header.tsx         # Contact link, theme toggle
└── contact-form.tsx
genesis.config.ts           # branding()
```

---

## See also

- [Branding module](../modules/branding.md)
- [Emails module](../modules/emails.md)
- [Templates index](../templates.md)
