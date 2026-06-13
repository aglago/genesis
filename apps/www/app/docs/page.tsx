import Link from "next/link";
import { DOC_NAV, MODULE_NAV } from "@/lib/docs-nav";

export const metadata = {
  title: "Documentation — Genesis",
};

export default function DocsIndexPage() {
  return (
    <main className="min-w-0 flex-1 px-6 py-10 md:px-10 lg:px-12">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-muted-foreground">Documentation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Genesis docs</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Guides for creating projects, configuring modules, and using the Genesis CLI.
        </p>
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Getting started
        </h2>
        <div className="mt-4 grid gap-3">
          {DOC_NAV.slice(0, 3).map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group rounded-lg border p-5 transition-colors hover:bg-accent/40"
            >
              <h3 className="font-medium group-hover:underline">{doc.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DOC_NAV.slice(3).map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group rounded-lg border p-5 transition-colors hover:bg-accent/40"
            >
              <h3 className="font-medium group-hover:underline">{doc.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 max-w-5xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Modules</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODULE_NAV.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group rounded-lg border p-4 transition-colors hover:bg-accent/40"
            >
              <h3 className="font-medium group-hover:underline">{doc.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
