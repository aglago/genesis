import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { getTemplatesDir, getGenesisRoot, getCliScaffoldDir } from "./manifests.js";
import { resolveLocalPackageRef } from "./local-packages.js";

export interface LinkGenesisPackagesOptions {
  /** Link to local monorepo packages via file: paths instead of the npm registry. */
  local?: boolean;
}

export interface NextJsTemplateOptions {
  projectName: string;
  targetDir: string;
}

export async function scaffoldNextJsApp(options: NextJsTemplateOptions): Promise<void> {
  const { targetDir } = options;

  await fs.ensureDir(targetDir);
  await fs.ensureDir(path.join(targetDir, "app"));

  const packageJson = {
    name: options.projectName,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
    },
    dependencies: {
      next: "^15.1.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "next-themes": "^0.4.4",
      "@genesis/core": "*",
    },
    devDependencies: {
      "@types/node": "^22.10.2",
      "@types/react": "^19.0.2",
      typescript: "^5.7.2",
      tailwindcss: "^3.4.17",
      postcss: "^8.4.49",
      autoprefixer: "^10.4.20",
    },
  };

  await fs.writeJson(path.join(targetDir, "package.json"), packageJson, { spaces: 2 });

  await fs.writeFile(
    path.join(targetDir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "genesis.config.ts"],
        exclude: ["node_modules"],
      },
      null,
      2,
    ),
  );

  await fs.writeFile(
    path.join(targetDir, "next.config.ts"),
    `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`,
  );

  await fs.writeFile(
    path.join(targetDir, "tailwind.config.ts"),
    `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@genesis/ui/dist/**/*.js",
    "./node_modules/@genesis/dashboard/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
`,
  );

  await fs.writeFile(
    path.join(targetDir, "postcss.config.mjs"),
    `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`,
  );

  const themeCss = await fs.readFile(
    path.join(getGenesisRoot(), "packages/ui/src/styles/genesis-theme.css"),
    "utf-8",
  );

  await fs.writeFile(
    path.join(targetDir, "app/globals.css"),
    `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
${themeCss}
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .genesis-inline-code {
    @apply border-0 shadow-none;
  }
}`,
  );

  await fs.writeFile(
    path.join(targetDir, "app/layout.tsx"),
    `import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicThemeToggle } from "@/components/public-theme-toggle";

export const metadata: Metadata = {
  title: "${options.projectName}",
  description: "Built with Genesis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <PublicThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
`,
  );

  await fs.writeFile(
    path.join(targetDir, "app/page.tsx"),
    `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
        Built with Genesis
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">${options.projectName}</h1>
      <p className="mt-4 text-muted-foreground">Your modular Next.js app starts here.</p>
    </main>
  );
}
`,
  );

  await fs.writeFile(path.join(targetDir, "next-env.d.ts"), `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n`);
  await fs.writeFile(path.join(targetDir, ".gitignore"), "node_modules\n.next\n.env\n.env.local\n");

  const scaffoldDir = getCliScaffoldDir();
  await fs.copy(path.join(scaffoldDir, "components"), path.join(targetDir, "components"));
}

export async function applyTemplate(templateName: string, targetDir: string): Promise<void> {
  const templateDir = path.join(getTemplatesDir(), templateName);

  if (!(await fs.pathExists(templateDir))) {
    return;
  }

  async function copyRecursive(src: string, dest: string) {
    const stat = await fs.stat(src);

    if (stat.isDirectory()) {
      await fs.ensureDir(dest);
      const entries = await fs.readdir(src);
      for (const entry of entries) {
        await copyRecursive(path.join(src, entry), path.join(dest, entry));
      }
    } else {
      await fs.ensureDir(path.dirname(dest));
      await fs.copy(src, dest, { overwrite: true });
    }
  }

  await copyRecursive(templateDir, targetDir);
}

export function installPackages(targetDir: string, packages: string[]): void {
  if (packages.length === 0) return;

  const genesisRoot = path.resolve(targetDir, "../../");
  const isMonorepo = packages.every((p) => p.startsWith("@genesis/"));

  if (isMonorepo) {
    execSync(`npm install ${packages.join(" ")} --save --workspace=${path.basename(targetDir)}`, {
      cwd: genesisRoot,
      stdio: "inherit",
    });
  } else {
    execSync(`npm install ${packages.join(" ")}`, { cwd: targetDir, stdio: "inherit" });
  }
}

export function linkGenesisPackages(
  targetDir: string,
  packages: string[],
  options: LinkGenesisPackagesOptions = {},
): void {
  const packageJsonPath = path.join(targetDir, "package.json");
  const pkg = fs.readJsonSync(packageJsonPath);

  for (const name of packages) {
    pkg.dependencies[name] = options.local ? resolveLocalPackageRef(targetDir, name) : "*";
  }

  if (packages.some((p) => p === "@genesis/ui" || p === "@genesis/dashboard" || p === "@genesis/auth")) {
    const uiRef = options.local ? resolveLocalPackageRef(targetDir, "@genesis/ui") : "*";
    pkg.dependencies["@genesis/ui"] = pkg.dependencies["@genesis/ui"] ?? uiRef;
  }

  fs.writeJsonSync(packageJsonPath, pkg, { spaces: 2 });
}
