import Link from "next/link";
import { TemplateCard } from "@/components/template-card";
import { TEMPLATE_PREVIEWS } from "@/lib/docs-nav";
import { CodeBlock } from "@genesis/ui";

const DETAILS: Record<string, { command: string; features: string[] }> = {
  "informational-site": {
    command: "genesis create my-site --local -y -t informational-site",
    features: [
      "Minimal landing page with hero and contact card",
      "shadcn-style Input, Button, Textarea from @genesis/ui",
      "Branding module with CSS variables",
      "Optional: emails, analytics",
    ],
  },
  "saas-app": {
    command: "genesis create my-saas --local -y -t saas-app",
    features: [
      "Auth with JWT and RBAC",
      "Paystack payments and webhooks",
      "Admin dashboard with sidebar",
      "Notifications module included",
    ],
  },
  ecommerce: {
    command: "genesis create my-store --local -y -t ecommerce",
    features: [
      "Buy now buttons wired to Paystack checkout",
      "Dashboard Orders page with live transaction data",
      "Branding, payments, and admin shell included",
      "Optional: auth, uploads, notifications",
    ],
  },
  custom: {
    command: "genesis create my-app --local -t custom",
    features: ["Branding included on every project", "Full module picker", "Blank home page to customize"],
  },
};

export const metadata = {
  title: "Templates — Genesis",
};

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          Starters
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Templates</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Each template layers pages and default modules on a shared Next.js 15 + Tailwind base.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEMPLATE_PREVIEWS.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      <div className="mx-auto mt-24 max-w-4xl space-y-20">
        {TEMPLATE_PREVIEWS.map((template) => {
          const detail = DETAILS[template.id];
          return (
            <section key={template.id} id={template.id} className="scroll-mt-20 border-t pt-16">
              <h2 className="text-2xl font-bold tracking-tight">{template.name}</h2>
              <p className="mt-3 text-muted-foreground">{template.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {template.modules.map((mod) => (
                  <span
                    key={mod}
                    className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium leading-none text-muted-foreground"
                  >
                    {mod}
                  </span>
                ))}
              </div>
              <ul className="mt-6 space-y-2">
                {detail.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-foreground">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CodeBlock code={detail.command} language="bash" />
              </div>
              <Link
                href={`/docs/templates/${template.id === "custom" ? "custom" : template.id}`}
                className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline"
              >
                Full template guide →
              </Link>
              <Link
                href="/docs/templates"
                className="mt-2 block text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                All templates
              </Link>
            </section>
          );
        })}
      </div>
    </main>
  );
}
