import fs from "fs-extra";
import path from "path";

export type ProjectStructure = "monolith" | "monorepo";

export function parseStructure(value?: string): ProjectStructure {
  if (!value || value === "monolith") return "monolith";
  if (value === "monorepo") return "monorepo";
  throw new Error(`Invalid structure: ${value}. Use "monolith" or "monorepo".`);
}

/** Resolve the Next.js app directory (where genesis.config.ts and app/ live). */
export function resolveAppDir(projectRoot: string, structure: ProjectStructure): string {
  return structure === "monorepo" ? path.join(projectRoot, "apps", "web") : projectRoot;
}

/** Find genesis app dir from cwd — supports monolith root and monorepo apps/web. */
export async function findGenesisAppDir(cwd: string = process.cwd()): Promise<string> {
  const configAtRoot = path.join(cwd, "genesis.config.ts");
  if (await fs.pathExists(configAtRoot)) {
    return cwd;
  }

  const configInWeb = path.join(cwd, "apps", "web", "genesis.config.ts");
  if (await fs.pathExists(configInWeb)) {
    return path.join(cwd, "apps", "web");
  }

  // cwd might already be apps/web without genesis.config yet
  if (path.basename(cwd) === "web") {
    const parentConfig = path.join(cwd, "genesis.config.ts");
    if (await fs.pathExists(parentConfig)) {
      return cwd;
    }
  }

  return cwd;
}

export async function detectProjectStructure(projectRoot: string): Promise<ProjectStructure> {
  const turboPath = path.join(projectRoot, "turbo.json");
  const webAppPath = path.join(projectRoot, "apps", "web");

  if ((await fs.pathExists(turboPath)) && (await fs.pathExists(webAppPath))) {
    return "monorepo";
  }

  return "monolith";
}

export async function scaffoldMonorepoRoot(projectName: string, targetDir: string): Promise<void> {
  await fs.ensureDir(targetDir);
  await fs.ensureDir(path.join(targetDir, "apps"));

  await fs.writeJson(
    path.join(targetDir, "package.json"),
    {
      name: projectName,
      private: true,
      workspaces: ["apps/*"],
      scripts: {
        dev: "turbo run dev",
        build: "turbo run build",
        lint: "turbo run lint",
        typecheck: "turbo run typecheck",
      },
      devDependencies: {
        turbo: "^2.3.3",
        typescript: "^5.7.2",
      },
      engines: {
        node: ">=20",
      },
    },
    { spaces: 2 },
  );

  await fs.writeJson(
    path.join(targetDir, "turbo.json"),
    {
      $schema: "https://turbo.build/schema.json",
      tasks: {
        dev: { cache: false, persistent: true },
        build: {
          dependsOn: ["^build"],
          outputs: [".next/**", "!.next/cache/**"],
        },
        lint: {},
        typecheck: {},
      },
    },
    { spaces: 2 },
  );

  await fs.writeFile(
    path.join(targetDir, ".gitignore"),
    `node_modules
.turbo
dist
*.tsbuildinfo
.env
.env.local
.env.*.local
.next
out
apps/*/.next
apps/*/out
`,
  );

  await fs.writeFile(
    path.join(targetDir, "README.md"),
    `# ${projectName}

Turborepo monorepo scaffolded with Genesis.

## Structure

\`\`\`
${projectName}/
├── apps/
│   └── web/          # Next.js app (genesis.config.ts lives here)
├── package.json      # Workspace root
└── turbo.json
\`\`\`

## Commands

Run from the repository root:

\`\`\`bash
npm install
cp apps/web/.env.example apps/web/.env
npm run dev
\`\`\`
`,
  );
}
