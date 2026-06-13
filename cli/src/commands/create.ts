import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { checkbox, input, select, confirm } from "@inquirer/prompts";
import type { ModuleId } from "@genesis/core";
import { resolveModuleOrder } from "@genesis/core";
import { loadAllManifests, getManifestById } from "../utils/manifests.js";
import {
  copyScaffoldFiles,
  mergeEnvExample,
  writeGenesisConfig,
  applyBrandingLayout,
} from "../utils/scaffold.js";
import { scaffoldNextJsApp, applyTemplate, linkGenesisPackages } from "../utils/template.js";
import {
  type ProjectStructure,
  parseStructure,
  resolveAppDir,
  scaffoldMonorepoRoot,
} from "../utils/structure.js";
import {
  getTemplateDefinition,
  formatModuleList,
  resolveModulesFromFlag,
  mergeTemplateModules,
  getSelectableModulesForTemplate,
} from "../utils/templates.js";
import { withSpinner } from "../utils/exit.js";

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

const ALL_MODULE_IDS: ModuleId[] = [
  "auth",
  "branding",
  "payments",
  "dashboard",
  "notifications",
  "emails",
  "uploads",
  "analytics",
];

export interface CreateOptions {
  template?: string;
  modules?: string;
  structure?: string;
  yes?: boolean;
  local?: boolean;
}

async function resolveModules(
  template: string,
  options: CreateOptions,
): Promise<ModuleId[]> {
  const def = getTemplateDefinition(template);

  if (options.modules) {
    const flagModules = options.modules.split(",").map((m) => m.trim()) as ModuleId[];
    return resolveModulesFromFlag(template, flagModules);
  }

  if (def.freeChoice) {
    if (options.yes) {
      return [];
    }
    return checkbox({
      message: "Select modules:",
      choices: ALL_MODULE_IDS.map((id) => ({
        name: MODULE_LABELS[id] ?? id,
        value: id,
        checked: false,
      })),
    });
  }

  // Named template — bundled modules
  console.log(chalk.dim(`\n  ${def.description}`));
  console.log(chalk.dim(`  Includes: ${formatModuleList(def.requiredModules, MODULE_LABELS)}\n`));

  if (options.yes) {
    return def.requiredModules;
  }

  const customize = await confirm({
    message: "Customize modules for this template?",
    default: false,
  });

  if (!customize) {
    return def.requiredModules;
  }

  const selectable = getSelectableModulesForTemplate(template, ALL_MODULE_IDS);

  const selected = await checkbox({
    message: "Modules (required modules are locked):",
    choices: selectable.map((id) => {
      const isRequired = def.requiredModules.includes(id);
      return {
        name: isRequired ? `${MODULE_LABELS[id] ?? id} (required)` : (MODULE_LABELS[id] ?? id),
        value: id,
        checked: isRequired,
        disabled: isRequired ? "Required by this template" : false,
      };
    }),
  });

  return mergeTemplateModules(template, selected as ModuleId[]);
}

export async function createCommand(name?: string, options: CreateOptions = {}): Promise<void> {
  console.log(chalk.bold("\n  Genesis — Create Project\n"));

  const manifests = await loadAllManifests();

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

  const selectedModules = await resolveModules(template, options);

  const targetDir = path.resolve(process.cwd(), projectName);
  const appDir = resolveAppDir(targetDir, structure);

  if (await fs.pathExists(targetDir)) {
    const overwrite = await confirm({ message: `Directory ${projectName} exists. Continue?`, default: false });
    if (!overwrite) {
      console.log(chalk.yellow("Cancelled."));
      return;
    }
  }

  await withSpinner("Creating project...", async (spinner) => {
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

    linkGenesisPackages(appDir, [...new Set(npmPackages)], { local: options.local });

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

    if (selectedModules.includes("branding")) {
      const layoutName = structure === "monorepo" ? "web" : projectName;
      await applyBrandingLayout(appDir, layoutName, {
        siteHeader: template === "informational-site",
      });
    }

    await mergeEnvExample(selectedManifests, appDir);

    spinner.succeed(chalk.green(`Project ${projectName} created! (${structure})`));
  });

  console.log(chalk.bold("\n  Next steps:\n"));
  console.log(`  cd ${projectName}`);
  if (structure === "monorepo") {
    console.log("  cp apps/web/.env.example apps/web/.env");
  } else {
    console.log("  cp .env.example .env");
  }
  console.log("  # Edit .env with your credentials");
  if (options.local) {
    console.log(chalk.dim("  # Local mode: build Genesis packages first if you haven't"));
    console.log(chalk.dim("  cd .. && npm run build && cd " + projectName));
  }
  console.log("  npm install");
  console.log("  npm run dev");
  console.log("");
}
