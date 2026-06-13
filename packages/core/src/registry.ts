import type { ModuleId, ModuleManifest } from "./index.js";
import { globalRegistry, loadManifest } from "./index.js";

let initialized = false;

export function initializeRegistry(manifests: ModuleManifest[]): void {
  if (initialized) return;

  for (const manifest of manifests) {
    loadManifest(manifest);
  }

  initialized = true;
}

export function getManifest(id: ModuleId): ModuleManifest | undefined {
  return globalRegistry.get(id);
}

export function getAllManifests(): ModuleManifest[] {
  return globalRegistry.getAll();
}

export const AVAILABLE_MODULES: ModuleId[] = [
  "auth",
  "branding",
  "payments",
  "dashboard",
  "notifications",
  "emails",
  "uploads",
  "analytics",
];
