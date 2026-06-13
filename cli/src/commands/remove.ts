import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import type { ModuleId } from "@genesis/core";
import { loadAllManifests, getManifestById } from "../utils/manifests.js";
import {
  removeScaffoldFiles,
  writeGenesisConfig,
  readGenesisConfig,
} from "../utils/scaffold.js";
import { findGenesisAppDir } from "../utils/structure.js";
import { withSpinner } from "../utils/exit.js";

export async function removeCommand(moduleName: string): Promise<void> {
  await loadAllManifests();
  const manifest = getManifestById(moduleName as ModuleId);

  if (!manifest) {
    console.log(chalk.red(`Unknown module: ${moduleName}`));
    process.exit(1);
  }

  const confirmed = await confirm({
    message: `Remove ${manifest.name} and its scaffolded files?`,
    default: false,
  });

  if (!confirmed) {
    console.log(chalk.yellow("Cancelled."));
    return;
  }

  const targetDir = await findGenesisAppDir();
  const existing = await readGenesisConfig(targetDir);

  if (!existing.includes(manifest.configFactory)) {
    console.log(chalk.yellow(`Module ${moduleName} is not installed.`));
    return;
  }

  await withSpinner(`Removing ${manifest.name}...`, async (spinner) => {
    const removed = await removeScaffoldFiles(manifest, targetDir);
    const remaining = existing.filter((id) => id !== manifest.configFactory);

    const manifests = (await loadAllManifests()).filter((m) =>
      remaining.includes(m.configFactory),
    );

    await writeGenesisConfig(
      targetDir,
      manifests.map((m) => ({
        id: m.id,
        configImport: m.configImport,
        configFactory: m.configFactory,
      })),
    );

    spinner.succeed(chalk.green(`Removed ${manifest.name}`));

    if (removed.length > 0) {
      console.log(chalk.dim(`  Removed: ${removed.join(", ")}`));
    }

    console.log(chalk.dim(`  Run npm uninstall ${manifest.npmPackage} to remove the package.`));
  });
}
