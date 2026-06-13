"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@genesis/ui";
import { DOC_NAV, MODULE_NAV, type DocNavItem } from "@/lib/docs-nav";

function NavSection({ title, items }: { title: string; items: DocNavItem[] }) {
  const pathname = usePathname();

  return (
    <div>
      <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const href = `/docs/${item.slug}`;
          const active = pathname === href;

          return (
            <li key={item.slug}>
              <Link
                href={href}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function DocsSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r md:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-6">
        <NavSection title="Getting Started" items={DOC_NAV.slice(0, 3)} />
        <div className="mt-8">
          <NavSection title="Guides" items={DOC_NAV.slice(3)} />
        </div>
        <div className="mt-8">
          <NavSection title="Modules" items={MODULE_NAV} />
        </div>
      </div>
    </aside>
  );
}
