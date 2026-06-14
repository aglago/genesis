import Link from "next/link";
import { Card } from "@genesis/ui";

export interface TemplatePreview {
  id: string;
  name: string;
  description: string;
  modules: string[];
  accent: string;
  href: string;
}

export function TemplateCard({ template }: { template: TemplatePreview }) {
  return (
    <Link href={template.href} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-colors hover:bg-accent/20">
        <div className="relative h-32 overflow-hidden border-b bg-muted p-5">
          <div className={`absolute inset-0 bg-gradient-to-br opacity-50 ${template.accent}`} aria-hidden />
          <div className="relative space-y-3">
            <div className="h-2 w-16 rounded-full bg-foreground/20" />
            <div className="h-16 rounded-md border border-foreground/15 bg-background/90 shadow-sm" />
            <div className="flex gap-2">
              <div className="h-1.5 w-10 rounded-full bg-foreground/15" />
              <div className="h-1.5 w-14 rounded-full bg-foreground/15" />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-medium tracking-tight group-hover:underline">{template.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {template.description}
          </p>
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
        </div>
      </Card>
    </Link>
  );
}
