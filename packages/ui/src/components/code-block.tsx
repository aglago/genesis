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

  return (
    <div
      className={cn(
        "group relative my-6 overflow-hidden rounded-lg border bg-[hsl(var(--code-background))] text-[hsl(var(--code-foreground))]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b bg-[hsl(var(--code-header))] px-0">
        {showTabs ? (
          <div className="flex items-center gap-0 px-1 pt-1">
            {PACKAGE_MANAGERS.map((pm) => (
              <button
                key={pm}
                type="button"
                onClick={() => setActivePm(pm)}
                className={cn(
                  "relative rounded-t-sm border border-transparent px-3 py-1.5 font-mono text-xs font-medium transition-colors",
                  activePm === pm
                    ? "border-border border-b-[hsl(var(--code-background))] bg-[hsl(var(--code-background))] text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {pm}
              </button>
            ))}
          </div>
        ) : (
          <span className="px-4 py-2 font-mono text-xs font-medium text-muted-foreground">
            {language ?? "code"}
          </span>
        )}

        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied ? (
            <span className="text-xs font-medium">✓</span>
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      <pre className="overflow-x-auto px-4 py-4">
        <code className="font-mono text-sm leading-relaxed">{displayCode}</code>
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return <code className="genesis-inline-code">{children}</code>;
}
