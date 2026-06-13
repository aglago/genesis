import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { checkbox, input, select, confirm } from "@inquirer/prompts";
import type { ModuleId } from "@genesis/core";
import { resolveModuleOrder } from "@genesis/core";
import { loadAllManifests, getManifestById } from "../utils/manifests.js";
import {
  copyScaffoldFiles,
  mergeEnvExample,
  writeGenesisConfig,
} from "../utils/scaffold.js";
import { scaffoldNextJsApp, applyTemplate, linkGenesisPackages } from "../utils/template.js";
import {
  type ProjectStructure,
  parseStructure,
  resolveAppDir,
  scaffoldMonorepoRoot,
} from "../utils/structure.js";

const MODULE_LABELS: Record<string, string> = {
  auth: "Authentication",
  branding: "Branding",
  payments: "Payments",
  dashboard: "Admin Dashboard",
  notifications: "Notifications",
  emails: "Email System",
  uploads: "File Uploads",
  analytics: "Analytics",
};

export interface CreateOptions {
  template?: string;
  modules?: string;
  structure?: string;
  yes?: boolean;
}

export async function createCommand(name?: string, options: CreateOptions = {}): Promise<void> {
  console.log(chalk.bold("\n  Genesis — Create Project\n"));

  const manifests = await loadAllManifests();
  const mvpModules = manifests.filter((m) =>
    ["auth", "branding", "payments", "dashboard", "notifications", "emails", "uploads", "analytics"].includes(m.id),
  );

  const projectName =
    name ??
    (options.yes
      ? "my-app"
      : await input({
          message: "Project name:",
          default: "my-app",
          validate: (v) => (v.trim().length > 0 ? true : "Project name is required"),
        }));

  const structure: ProjectStructure = options.structure
    ? parseStructure(options.structure)
    : options.yes
      ? "monolith"
      : await select({
          message: "Project structure:",
          choices: [
            {
              name: "Monolith — single Next.js app (recommended)",
              value: "monolith" as const,
            },
            {
              name: "Monorepo — Turborepo with apps/web",
              value: "monorepo" as const,
            },
          ],
          default: "monolith",
        });

  const template = options.template
    ? options.template
    : options.yes
      ? "saas-app"
      : await select({
          message: "Select template:",
          choices: [
            { name: "Blank (custom)", value: "custom" },
            { name: "Informational Website", value: "informational-site" },
            { name: "SaaS Starter", value: "saas-app" },
            { name: "E-commerce", value: "ecommerce" },
          ],
        });

  const defaultModules: ModuleId[] =
    template === "saas-app"
      ? ["auth", "branding", "payments", "dashboard"]
      : template === "informational-site"
        ? ["branding"]
        : template === "ecommerce"
          ? ["payments", "dashboard"]
          : [];

  const selectedModules: ModuleId[] = options.modules
    ? (options.modules.split(",").map((m) => m.trim()) as ModuleId[])
    : options.yes
      ? defaultModules
      : await checkbox({
          message: "Select modules:",
          choices: mvpModules.map((m) => ({
            name: MODULE_LABELS[m.id] ?? m.name,
            value: m.id,
            checked: defaultModules.includes(m.id),
          })),
        });

  const targetDir = path.resolve(process.cwd(), projectName);
  const appDir = resolveAppDir(targetDir, structure);

  if (await fs.pathExists(targetDir)) {
    const overwrite = await confirm({ message: `Directory ${projectName} exists. Continue?`, default: false });
    if (!overwrite) {
      console.log(chalk.yellow("Cancelled."));
      return;
    }
  }

  const spinner = ora("Creating project...").start();

  try {
    if (structure === "monorepo") {
      await scaffoldMonorepoRoot(projectName, targetDir);
    }

    await scaffoldNextJsApp({
      projectName: structure === "monorepo" ? "web" : projectName,
      targetDir: appDir,
    });
    await applyTemplate(template, appDir);

    const orderedIds = resolveModuleOrder(selectedModules as ModuleId[], manifests);
    const selectedManifests = orderedIds
      .map((id) => getManifestById(id))
      .filter(Boolean) as typeof manifests;

    const npmPackages = ["@genesis/core", "@genesis/database", "@genesis/ui", ...selectedManifests.map((m) => m.npmPackage)];

    linkGenesisPackages(appDir, [...new Set(npmPackages)]);

    await writeGenesisConfig(
      appDir,
      selectedManifests.map((m) => ({
        id: m.id,
        configImport: m.configImport,
        configFactory: m.configFactory,
      })),
    );

    for (const manifest of selectedManifests) {
      await copyScaffoldFiles(manifest, appDir, { force: true });
    }

    await mergeEnvExample(selectedManifests, appDir);

    spinner.succeed(chalk.green(`Project ${projectName} created! (${structure})`));

    console.log(chalk.bold("\n  Next steps:\n"));
    console.log(`  cd ${projectName}`);
    if (structure === "monorepo") {
      console.log("  cp apps/web/.env.example apps/web/.env");
    } else {
      console.log("  cp .env.example .env");
    }
    console.log("  # Edit .env with your credentials");
    console.log("  npm install");
    console.log("  npm run dev");
    console.log("");
  } catch (error) {
    spinner.fail(chalk.red("Failed to create project"));
    throw error;
  }
}
