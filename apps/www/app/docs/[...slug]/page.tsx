import { notFound } from "next/navigation";
import { DocsToc } from "@/components/docs-toc";
import { MarkdownContent } from "@/components/markdown-content";
import { DOC_NAV, TEMPLATE_DOC_NAV, MODULE_NAV, extractHeadings, getDocContent, getTitle } from "@/lib/content";

interface DocPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs = [...DOC_NAV, ...TEMPLATE_DOC_NAV, ...MODULE_NAV].map((d) => ({
    slug: d.slug.split("/"),
  }));
  return slugs;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  return { title: `${getTitle(slug)} — Genesis Docs` };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  const content = getDocContent(slug);

  if (!content) {
    notFound();
  }

  const headings = extractHeadings(content);
  const title = getTitle(slug);

  return (
    <>
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10 lg:max-w-3xl lg:px-12">
        <p className="text-sm font-medium text-muted-foreground">Documentation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
        <div className="mt-8">
          <MarkdownContent content={content} />
        </div>
      </main>
      <DocsToc headings={headings} />
    </>
  );
}
