"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { CodeBlock, InlineCode, cn } from "@genesis/ui";

interface MarkdownContentProps {
  content: string;
}

function getCodeFromPre(children: ReactNode): { code: string; language?: string } {
  if (!children || typeof children !== "object" || !("props" in children)) {
    return { code: String(children ?? "") };
  }

  const child = children as { props?: { className?: string; children?: string } };
  const className = child.props?.className ?? "";
  const language = className.replace("language-", "") || undefined;
  const code = String(child.props?.children ?? "").replace(/\n$/, "");

  return { code, language };
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose prose-zinc max-w-none dark:prose-invert",
        "prose-headings:scroll-mt-20",
        "prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2 prose-h2:text-2xl prose-h2:text-foreground",
        "prose-h3:mt-8 prose-h3:text-xl prose-h3:text-foreground",
        "prose-p:leading-7 prose-p:text-muted-foreground",
        "prose-a:font-medium prose-a:text-foreground prose-a:no-underline prose-a:underline-offset-4 hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-medium",
        "prose-li:text-muted-foreground",
        "prose-hr:border-border",
        "prose-blockquote:border-l-border prose-blockquote:text-muted-foreground",
        "prose-table:text-sm",
        "prose-th:text-foreground prose-th:font-medium",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent",
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          pre: ({ children }) => {
            const { code, language } = getCodeFromPre(children);
            return <CodeBlock code={code} language={language} />;
          },
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return <InlineCode>{children}</InlineCode>;
          },
          table: ({ children, ...props }) => (
            <div className="my-6 overflow-hidden rounded-lg border">
              <table className="w-full text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="border-b bg-muted/50 px-4 py-2 text-left font-medium" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border-b px-4 py-2 text-muted-foreground last:border-0" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
