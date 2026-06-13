import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { isCompatible } from "@genesis/core";
import { loadAllManifests } from "../utils/manifests.js";
import { readGenesisConfig } from "../utils/scaffold.js";
import { findGenesisAppDir } from "../utils/structure.js";
import { withSpinner } from "../utils/exit.js";

const CORE_VERSION = "0.1.0";

export async function updateCommand(): Promise<void> {
  console.log(chalk.bold("\n  Genesis — Update Modules\n"));

  await loadAllManifests();
  const targetDir = await findGenesisAppDir();
  const existing = await readGenesisConfig(targetDir);

  if (existing.length === 0) {
    console.log(chalk.yellow("No Genesis modules found in this project."));
    return;
  }

  const incompatible = existing.filter((id) => !isCompatible(id as Parameters<typeof isCompatible>[0], CORE_VERSION));

  if (incompatible.length > 0) {
    console.log(chalk.red(`Incompatible modules: ${incompatible.join(", ")}`));
    console.log(chalk.dim(`Requires @genesis/core >= ${CORE_VERSION}`));
    return;
  }

  await withSpinner("Updating @genesis/* packages...", async (spinner) => {
    const packageJsonPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJson(packageJsonPath);
    const genesisPackages = Object.keys(pkg.dependencies ?? {}).filter((d) => d.startsWith("@genesis/"));

    if (genesisPackages.length === 0) {
      spinner.warn(chalk.yellow("No @genesis packages in dependencies."));
      return;
    }

    execSync(`npm update ${genesisPackages.join(" ")}`, { cwd: targetDir, stdio: "pipe" });

    spinner.succeed(chalk.green("Modules updated successfully!"));
    console.log(chalk.dim(`  Updated: ${genesisPackages.join(", ")}`));
    console.log(chalk.dim("  Review scaffold diffs if routes changed between versions."));
  });
}
