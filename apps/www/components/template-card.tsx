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
        <div className={`h-32 bg-gradient-to-br ${template.accent} p-5`}>
          <div className="h-2 w-16 rounded-full bg-white/25" />
          <div className="mt-4 h-16 rounded-md border border-white/10 bg-white/10 backdrop-blur-sm" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-medium tracking-tight group-hover:underline">{template.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {template.description}
          </p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            {template.modules.join(" · ")}
          </p>
        </div>
      </Card>
    </Link>
  );
}
