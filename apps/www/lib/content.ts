import fs from "fs";
import path from "path";
import { DOC_NAV, MODULE_NAV } from "./docs-nav";

export type { DocNavItem } from "./docs-nav";
export { DOC_NAV, MODULE_NAV, TEMPLATE_PREVIEWS } from "./docs-nav";

const DOCS_ROOT = path.join(process.cwd(), "..", "..", "docs");

export interface DocHeading {
  level: number;
  text: string;
  id: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractHeadings(content: string): DocHeading[] {
  const headings: DocHeading[] = [];

  for (const line of content.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].replace(/`/g, "").trim();
    headings.push({ level, text, id: slugify(text) });
  }

  return headings;
}

export function getDocSlugs(): string[] {
  const entries = fs.readdirSync(DOCS_ROOT, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => e.name.replace(/\.md$/, ""));

  const moduleDir = path.join(DOCS_ROOT, "modules");
  if (fs.existsSync(moduleDir)) {
    const modules = fs
      .readdirSync(moduleDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => `modules/${f.replace(/\.md$/, "")}`);
    return [...files, ...modules].sort();
  }

  return files.sort();
}

export function getDocContent(slug: string): string | null {
  const filePath = path.join(DOCS_ROOT, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getTitle(slug: string): string {
  const all = [...DOC_NAV, ...MODULE_NAV];
  return all.find((d) => d.slug === slug)?.title ?? slug;
}
