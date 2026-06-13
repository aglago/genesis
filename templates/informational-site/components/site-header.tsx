import Link from "next/link";

export function SiteHeader({ appName }: { appName: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {appName}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#contact" className="text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
