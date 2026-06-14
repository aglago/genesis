"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { cn } from "../index.js";

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function shouldShowPackageTabs(code: string, language?: string): boolean {
  const shellLang = !language || ["bash", "sh", "shell", "text", "zsh"].includes(language);
  if (!shellLang) return false;

  const trimmed = code.trim();
  return /^(npm|npx|pnpm|yarn|bun)\b/m.test(trimmed);
}

function toPackageManager(code: string, pm: PackageManager): string {
  let result = code.trim();

  result = result
    .replace(/^pnpm dlx /gm, "npx ")
    .replace(/^pnpm install /gm, "npm install ")
    .replace(/^pnpm /gm, "npm run ")
    .replace(/^yarn dlx /gm, "npx ")
    .replace(/^yarn add /gm, "npm install ")
    .replace(/^yarn /gm, "npm run ")
    .replace(/^bunx /gm, "npx ")
    .replace(/^bun install /gm, "npm install ")
    .replace(/^bun run /gm, "npm run ");

  switch (pm) {
    case "pnpm":
      return result
        .replace(/^npx /gm, "pnpm dlx ")
        .replace(/^npm install /gm, "pnpm install ")
        .replace(/^npm run /gm, "pnpm ")
        .replace(/^npm ci/gm, "pnpm install");
    case "yarn":
      return result
        .replace(/^npx /gm, "yarn dlx ")
        .replace(/^npm install /gm, "yarn add ")
        .replace(/^npm run /gm, "yarn ")
        .replace(/^npm ci/gm, "yarn install");
    case "bun":
      return result
        .replace(/^npx /gm, "bunx ")
        .replace(/^npm install /gm, "bun install ")
        .replace(/^npm run /gm, "bun run ")
        .replace(/^npm ci/gm, "bun install");
    default:
      return result;
  }
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const showTabs = shouldShowPackageTabs(code, language);
  const [activePm, setActivePm] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);

  const displayCode = useMemo(
    () => (showTabs ? toPackageManager(code, activePm) : code.trim()),
    [code, activePm, showTabs],
  );

  async function copy() {
    await navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const headerLabel = language ?? "code";

  return (
    <figure
      className={cn(
        "not-prose group relative my-6 overflow-hidden rounded-lg border border-border bg-[hsl(var(--code-background))] text-[hsl(var(--code-foreground))]",
        className,
      )}
    >
      <figcaption className="flex items-stretch border-b border-border/60 bg-[hsl(var(--code-header))]">
        <div className="flex min-w-0 flex-1 items-center gap-2 pl-3">
          <TerminalIcon className="h-4 w-4 shrink-0 text-muted-foreground" />

          {showTabs ? (
            <div className="flex min-w-0 items-end self-stretch pt-1">
              {PACKAGE_MANAGERS.map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setActivePm(pm)}
                  className={cn(
                    "relative -mb-px rounded-t-md border border-transparent px-3 py-1.5 font-mono text-xs font-medium transition-colors",
                    activePm === pm
                      ? "border-border/60 border-b-[hsl(var(--code-background))] bg-[hsl(var(--code-background))] text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {pm}
                </button>
              ))}
            </div>
          ) : (
            <span className="py-2.5 font-mono text-xs font-medium text-muted-foreground">{headerLabel}</span>
          )}
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          {copied ? (
            <span className="text-xs font-medium text-foreground">✓</span>
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
        </button>
      </figcaption>

      <pre className="overflow-x-auto px-4 py-4">
        <code className="font-mono text-[0.8125rem] leading-relaxed text-[hsl(var(--code-foreground))]">
          {displayCode}
        </code>
      </pre>
    </figure>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="genesis-inline-code relative rounded-md bg-[hsl(var(--inline-code-background))] px-[0.3rem] py-[0.2rem] font-mono text-[0.8125rem] font-normal text-[hsl(var(--inline-code-foreground))]">
      {children}
    </code>
  );
}
