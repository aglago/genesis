export interface DocNavItem {
  slug: string;
  title: string;
  description?: string;
}

export const DOC_NAV: DocNavItem[] = [
  { slug: "quickstart", title: "Quickstart", description: "Install Genesis and create your first project" },
  { slug: "templates", title: "Templates", description: "Starter templates — not complete apps; read before you build" },
  { slug: "cli", title: "CLI Reference", description: "create, add, remove, and update commands" },
  { slug: "workflows", title: "Workflows", description: "Portfolio, SaaS, and incremental setups" },
  { slug: "configuration", title: "Configuration", description: "Environment variables and genesis.config.ts" },
  { slug: "publishing", title: "Publishing", description: "Local dev, Git tags, and GitHub Packages" },
  { slug: "troubleshooting", title: "Troubleshooting", description: "Common errors and fixes" },
];

export const TEMPLATE_DOC_NAV: DocNavItem[] = [
  { slug: "templates/overview", title: "What is a template?", description: "Starter vs complete app" },
  { slug: "templates/modules", title: "Modules explained", description: "What each @genesis/* module adds" },
  { slug: "templates/base-scaffold", title: "Base scaffold", description: "Files every project gets" },
  { slug: "templates/project-structure", title: "Project structure", description: "Monolith vs monorepo" },
  { slug: "templates/custom", title: "Blank (custom)", description: "Pick any modules yourself" },
  { slug: "templates/informational-site", title: "Informational Website", description: "Landing page + contact" },
  { slug: "templates/saas-app", title: "SaaS Starter", description: "Auth, payments, dashboard" },
  { slug: "templates/ecommerce", title: "E-commerce", description: "Storefront + payments" },
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
    accent: "from-primary/10 to-primary/5",
    href: "/templates#informational-site",
  },
  {
    id: "saas-app",
    name: "SaaS Starter",
    description: "Auth, billing hooks, and dashboard starter — not a complete SaaS.",
    modules: ["auth", "branding", "payments", "dashboard", "notifications"],
    accent: "from-primary/15 to-primary/5",
    href: "/templates#saas-app",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Storefront starter with payments and admin dashboard.",
    modules: ["payments", "dashboard", "branding"],
    accent: "from-primary/10 to-muted",
    href: "/templates#ecommerce",
  },
  {
    id: "custom",
    name: "Blank (custom)",
    description: "Branding plus full module picker — build exactly what you need.",
    modules: ["branding", "+ your choice"],
    accent: "from-muted-foreground/10 to-muted",
    href: "/templates#custom",
  },
];
