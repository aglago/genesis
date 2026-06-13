import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { getTemplatesDir } from "./manifests.js";

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
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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

  await fs.writeFile(
    path.join(targetDir, "app/globals.css"),
    `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }
}
`,
  );

  await fs.writeFile(
    path.join(targetDir, "app/layout.tsx"),
    `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${options.projectName}",
  description: "Built with Genesis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  );

  await fs.writeFile(
    path.join(targetDir, "app/page.tsx"),
    `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">${options.projectName}</h1>
      <p className="mt-4 text-muted-foreground">Built with Genesis</p>
    </main>
  );
}
`,
  );

  await fs.writeFile(path.join(targetDir, "next-env.d.ts"), `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n`);
  await fs.writeFile(path.join(targetDir, ".gitignore"), "node_modules\n.next\n.env\n.env.local\n");
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

export function linkGenesisPackages(targetDir: string, packages: string[]): void {
  const packageJsonPath = path.join(targetDir, "package.json");
  const pkg = fs.readJsonSync(packageJsonPath);

  for (const name of packages) {
    pkg.dependencies[name] = "*";
  }

  if (packages.some((p) => p === "@genesis/ui" || p === "@genesis/dashboard" || p === "@genesis/auth")) {
    pkg.dependencies["@genesis/ui"] = pkg.dependencies["@genesis/ui"] ?? "*";
  }

  fs.writeJsonSync(packageJsonPath, pkg, { spaces: 2 });
}
