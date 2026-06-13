import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl border-t">
      <DocsSidebar />
      <div className="flex min-w-0 flex-1">{children}</div>
    </div>
  );
}
