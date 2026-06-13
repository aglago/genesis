import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Genesis — modular Next.js starter &amp; component ecosystem.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/docs" className="transition-colors hover:text-foreground">
            Docs
          </Link>
          <Link href="/templates" className="transition-colors hover:text-foreground">
            Templates
          </Link>
          <Link href="/docs/cli" className="transition-colors hover:text-foreground">
            CLI
          </Link>
        </div>
      </div>
    </footer>
  );
}
