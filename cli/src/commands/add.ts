import path from "path";
import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import type { ModuleId } from "@genesis/core";
import { resolveModuleOrder } from "@genesis/core";
import { loadAllManifests, getManifestById } from "../utils/manifests.js";
import {
  copyScaffoldFiles,
  mergeEnvExample,
  writeGenesisConfig,
  readGenesisConfig,
} from "../utils/scaffold.js";
import { linkGenesisPackages } from "../utils/template.js";
import { findGenesisAppDir } from "../utils/structure.js";
import { withSpinner } from "../utils/exit.js";
import { usesLocalPackages } from "../utils/local-packages.js";

export interface AddOptions {
  local?: boolean;
}

export async function addCommand(moduleName: string, options: AddOptions = {}): Promise<void> {
  const manifests = await loadAllManifests();
  const manifest = getManifestById(moduleName as ModuleId);

  if (!manifest) {
    console.log(chalk.red(`Unknown module: ${moduleName}`));
    console.log(chalk.dim(`Available: ${manifests.map((m) => m.id).join(", ")}`));
    process.exit(1);
  }

  const targetDir = await findGenesisAppDir();
  const existing = await readGenesisConfig(targetDir);

  if (existing.includes(manifest.configFactory)) {
    console.log(chalk.yellow(`Module ${moduleName} is already installed.`));
    return;
  }

  const deps = manifest.dependencies ?? [];
  const missingDeps = deps.filter((d) => !existing.includes(d));

  if (missingDeps.length > 0) {
    console.log(chalk.yellow(`Installing dependencies first: ${missingDeps.join(", ")}`));
    for (const dep of missingDeps) {
      await addCommand(dep, options);
    }
  }

  const useLocal = options.local ?? usesLocalPackages(targetDir);

  await withSpinner(`Adding ${manifest.name}...`, async (spinner) => {
    linkGenesisPackages(
      targetDir,
      [manifest.npmPackage, "@genesis/core", "@genesis/database", "@genesis/ui"],
      { local: useLocal },
    );

    const allModuleIds = [...existing, moduleName] as ModuleId[];
    const orderedIds = resolveModuleOrder(allModuleIds, manifests);
    const allManifests = orderedIds.map((id) => getManifestById(id)).filter(Boolean) as typeof manifests;

    await writeGenesisConfig(
      targetDir,
      allManifests.map((m) => ({
        id: m.id,
        configImport: m.configImport,
        configFactory: m.configFactory,
      })),
    );

    const copied = await copyScaffoldFiles(manifest, targetDir);
    await mergeEnvExample([manifest], targetDir);

    spinner.succeed(chalk.green(`Added ${manifest.name}`));

    if (copied.length > 0) {
      console.log(chalk.dim(`  Scaffolded: ${copied.join(", ")}`));
    }

    if (manifest.envVars.some((v) => v.required)) {
      console.log(chalk.yellow("\n  Required env vars:"));
      for (const envVar of manifest.envVars.filter((v) => v.required)) {
        console.log(chalk.dim(`    ${envVar.key} — ${envVar.description}`));
      }
    }
  });
}
