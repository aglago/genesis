import fs from "fs-extra";
import path from "path";
import type { ModuleId, ModuleManifest } from "@genesis/core";
import { getPackageScaffoldDir } from "./manifests.js";

/** Modules that connect to MongoDB at runtime — include DB env vars when any are installed. */
const DATABASE_MODULE_IDS = new Set<ModuleId>([
  "auth",
  "payments",
  "dashboard",
  "notifications",
  "emails",
  "uploads",
  "analytics",
]);

export async function copyScaffoldFiles(
  manifest: ModuleManifest,
  targetDir: string,
  options: { force?: boolean } = {},
): Promise<string[]> {
  const copied: string[] = [];
  const scaffoldDir = getPackageScaffoldDir(manifest.id);

  for (const file of manifest.scaffoldFiles) {
    const sourcePath = path.join(scaffoldDir, file.source.replace(/^scaffold\//, ""));
    const targetPath = path.join(targetDir, file.target);

    if (!(await fs.pathExists(sourcePath))) {
      if (file.optional) continue;
      throw new Error(`Scaffold source not found: ${sourcePath}`);
    }

    if ((await fs.pathExists(targetPath)) && !options.force) {
      continue;
    }

    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(sourcePath, targetPath);
    copied.push(file.target);
  }

  return copied;
}

export async function removeScaffoldFiles(
  manifest: ModuleManifest,
  targetDir: string,
): Promise<string[]> {
  const removed: string[] = [];

  for (const file of manifest.scaffoldFiles) {
    const targetPath = path.join(targetDir, file.target);
    if (await fs.pathExists(targetPath)) {
      await fs.remove(targetPath);
      removed.push(file.target);
    }
  }

  return removed;
}

export async function mergeEnvExample(
  manifests: ModuleManifest[],
  targetDir: string,
): Promise<void> {
  const envPath = path.join(targetDir, ".env.example");
  let existing = "";

  if (await fs.pathExists(envPath)) {
    existing = await fs.readFile(envPath, "utf-8");
  }

  const lines = new Set(existing.split("\n").filter(Boolean));

  for (const manifest of manifests) {
    for (const envVar of manifest.envVars) {
      const comment = `# ${envVar.description}`;
      const line = `${envVar.key}=${envVar.example ?? ""}`;
      lines.add(comment);
      lines.add(line);
    }
  }

  const needsDatabase = manifests.some((m) => DATABASE_MODULE_IDS.has(m.id));

  if (needsDatabase) {
    lines.add("# MongoDB — local default; replace with your Atlas URI in production");
    lines.add("MONGODB_URI=mongodb://localhost:27017");
    lines.add("MONGODB_DB_NAME=genesis");
  }

  await fs.writeFile(envPath, Array.from(lines).join("\n") + "\n");
}

export async function applyBrandingLayout(targetDir: string, projectName: string): Promise<void> {
  const layoutPath = path.join(targetDir, "app/layout.tsx");

  const content = `import type { Metadata } from "next";
import "./globals.css";
import "./globals.branding.css";
import { BrandingProvider } from "@/components/genesis/branding-provider";
import genesisConfig from "../genesis.config";
import type { BrandingConfig } from "@genesis/branding";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Built with Genesis",
};

const brandingModule = genesisConfig.modules.find((m) => m.id === "branding");
const brandingConfig = (brandingModule?.options ?? {
  primaryColor: "#000000",
  logo: "/logo.svg",
  appName: "My App",
  fontFamily: "Inter, sans-serif",
}) as BrandingConfig;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BrandingProvider config={brandingConfig}>{children}</BrandingProvider>
      </body>
    </html>
  );
}
`;

  await fs.writeFile(layoutPath, content);
}

export function generateGenesisConfig(
  modules: Array<{ id: string; configImport: string; configFactory: string; options?: Record<string, unknown> }>,
): string {
  const imports = modules.map((m) => `import ${m.configFactory} from "${m.configImport}";`);
  const moduleCalls = modules.map((m) => {
    const opts = m.options ? JSON.stringify(m.options) : "";
    return opts ? `    ${m.configFactory}(${opts}),` : `    ${m.configFactory}(),`;
  });

  return `import { defineGenesisConfig } from "@genesis/core";
${imports.join("\n")}

export default defineGenesisConfig({
  modules: [
${moduleCalls.join("\n")}
  ],
});
`;
}

export async function writeGenesisConfig(
  targetDir: string,
  modules: Array<{ id: string; configImport: string; configFactory: string; options?: Record<string, unknown> }>,
): Promise<void> {
  const content = generateGenesisConfig(modules);
  await fs.writeFile(path.join(targetDir, "genesis.config.ts"), content);
}

export async function readGenesisConfig(targetDir: string): Promise<string[]> {
  const configPath = path.join(targetDir, "genesis.config.ts");
  if (!(await fs.pathExists(configPath))) return [];

  const content = await fs.readFile(configPath, "utf-8");
  const moduleIds: string[] = [];
  const regex = /(\w+)\(\{/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    moduleIds.push(match[1]);
  }

  return moduleIds;
}
