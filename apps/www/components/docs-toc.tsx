import Link from "next/link";
import { cn } from "@genesis/ui";
import type { DocHeading } from "@/lib/content";

export function DocsToc({ headings }: { headings: DocHeading[] }) {
  const toc = headings.filter((h) => h.level <= 3);

  if (toc.length === 0) return null;

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pl-6">
        <p className="mb-4 text-sm font-medium">On this page</p>
        <ul className="space-y-2.5 border-l border-border pl-4 text-sm">
          {toc.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "block text-muted-foreground transition-colors hover:text-foreground",
                  heading.level === 3 && "pl-2",
                )}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
