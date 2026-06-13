export interface DocNavItem {
  slug: string;
  title: string;
  description?: string;
}

export const DOC_NAV: DocNavItem[] = [
  { slug: "quickstart", title: "Quickstart", description: "Install Genesis and create your first project" },
  { slug: "templates", title: "Templates", description: "Informational, SaaS, e-commerce, and custom starters" },
  { slug: "cli", title: "CLI Reference", description: "create, add, remove, and update commands" },
  { slug: "workflows", title: "Workflows", description: "Portfolio, SaaS, and incremental setups" },
  { slug: "configuration", title: "Configuration", description: "Environment variables and genesis.config.ts" },
  { slug: "publishing", title: "Publishing", description: "Local dev, Git tags, and GitHub Packages" },
  { slug: "troubleshooting", title: "Troubleshooting", description: "Common errors and fixes" },
];

export const MODULE_NAV: DocNavItem[] = [
  { slug: "modules/auth", title: "Auth", description: "Registration, login, JWT, RBAC" },
  { slug: "modules/branding", title: "Branding", description: "Logo, colors, typography" },
  { slug: "modules/payments", title: "Payments", description: "Paystack payments and webhooks" },
  { slug: "modules/dashboard", title: "Dashboard", description: "Admin sidebar, tables, settings" },
  { slug: "modules/emails", title: "Emails", description: "Transactional email" },
  { slug: "modules/notifications", title: "Notifications", description: "In-app and email alerts" },
  { slug: "modules/uploads", title: "Uploads", description: "Cloudinary and S3 uploads" },
  { slug: "modules/analytics", title: "Analytics", description: "Event tracking and metrics" },
];

export const TEMPLATE_PREVIEWS = [
  {
    id: "informational-site",
    name: "Informational Website",
    description: "Minimal landing page with shadcn contact form and branding.",
    modules: ["branding"],
    accent: "from-zinc-800 to-zinc-950",
    href: "/templates#informational-site",
  },
  {
    id: "saas-app",
    name: "SaaS Starter",
    description: "Auth, billing, dashboard, and notifications out of the box.",
    modules: ["auth", "branding", "payments", "dashboard", "notifications"],
    accent: "from-zinc-700 to-zinc-900",
    href: "/templates#saas-app",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Storefront starter with payments and admin dashboard.",
    modules: ["payments", "dashboard"],
    accent: "from-zinc-600 to-zinc-900",
    href: "/templates#ecommerce",
  },
  {
    id: "custom",
    name: "Blank (custom)",
    description: "Full module picker — build exactly what you need.",
    modules: ["your choice"],
    accent: "from-zinc-500 to-zinc-800",
    href: "/templates#custom",
  },
];
