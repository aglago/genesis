import Link from "next/link";
import { Button } from "@genesis/ui";
import { TemplateCard } from "@/components/template-card";
import { DOC_NAV, TEMPLATE_PREVIEWS } from "@/lib/docs-nav";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-screen-2xl">
      <section className="flex flex-col items-center px-6 pb-24 pt-20 text-center sm:pt-28">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          Modular Next.js starter
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Production apps, assembled in minutes
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Genesis ships auth, payments, dashboards, branding, and more as installable modules.
          Pick a template, scaffold with the CLI, ship.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/docs/quickstart">
            <Button size="lg">Get started</Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline" size="lg">
              Browse templates
            </Button>
          </Link>
        </div>
      </section>

      <section className="border-y bg-muted/40 py-20">
        <div className="px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">Templates</h2>
            <p className="mt-3 text-muted-foreground">
              Opinionated starters with modules pre-installed. Extend anytime with the CLI.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATE_PREVIEWS.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">Documentation</h2>
          <p className="mt-3 text-muted-foreground">
            Guides for creating projects, configuring modules, and publishing packages.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_NAV.slice(0, 6).map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group rounded-lg border bg-card p-5 transition-colors hover:bg-accent/40"
            >
              <h3 className="font-medium group-hover:underline">{doc.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{doc.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
