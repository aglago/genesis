import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import type { ModuleId, ModuleManifest } from "@genesis/core";
import { initializeRegistry, getAllManifests } from "@genesis/core/registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONOREPO_ROOT = path.resolve(__dirname, "../../..");
const PACKAGES_DIR = path.join(MONOREPO_ROOT, "packages");

export async function loadAllManifests(): Promise<ModuleManifest[]> {
  const manifests: ModuleManifest[] = [];
  const packageDirs = await fs.readdir(PACKAGES_DIR);

  for (const dir of packageDirs) {
    const manifestPath = path.join(PACKAGES_DIR, dir, "src", "manifest.json");
    if (await fs.pathExists(manifestPath)) {
      const manifest = (await fs.readJson(manifestPath)) as ModuleManifest;
      manifests.push(manifest);
    }
  }

  initializeRegistry(manifests);
  return manifests;
}

export function getManifestById(id: ModuleId): ModuleManifest | undefined {
  return getAllManifests().find((m) => m.id === id);
}

export function getPackageScaffoldDir(moduleId: ModuleId): string {
  return path.join(PACKAGES_DIR, moduleId, "src", "scaffold");
}

export function getTemplatesDir(): string {
  return path.join(MONOREPO_ROOT, "templates");
}

export function getGenesisRoot(): string {
  return MONOREPO_ROOT;
}
