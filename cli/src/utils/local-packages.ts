import fs from "fs-extra";
import path from "path";
import { getGenesisRoot } from "./manifests.js";

/** Map @genesis/* package name to a file: dependency relative to the target app. */
export function resolveLocalPackageRef(targetDir: string, packageName: string): string {
  if (!packageName.startsWith("@genesis/")) {
    throw new Error(`Not a Genesis package: ${packageName}`);
  }

  const shortName = packageName.slice("@genesis/".length);
  const packageDir = path.join(getGenesisRoot(), "packages", shortName);

  if (!fs.existsSync(path.join(packageDir, "package.json"))) {
    throw new Error(
      `Local package not found: ${packageName} (expected at ${packageDir}). ` +
        "Run npm run build from the Genesis monorepo root.",
    );
  }

  let relativePath = path.relative(targetDir, packageDir);
  if (!relativePath.startsWith(".")) {
    relativePath = `./${relativePath}`;
  }

  return `file:${relativePath.split(path.sep).join("/")}`;
}

/** True when the project already links @genesis/* via file: paths. */
export function usesLocalPackages(targetDir: string): boolean {
  const packageJsonPath = path.join(targetDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) return false;

  const pkg = fs.readJsonSync(packageJsonPath) as { dependencies?: Record<string, string> };
  return Object.entries(pkg.dependencies ?? {}).some(
    ([name, version]) => name.startsWith("@genesis/") && version.startsWith("file:"),
  );
}
