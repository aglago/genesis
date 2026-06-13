import { z } from "zod";

export const moduleIdSchema = z.enum([
  "auth",
  "branding",
  "payments",
  "dashboard",
  "notifications",
  "emails",
  "uploads",
  "analytics",
  "database",
  "ui",
]);

export type ModuleId = z.infer<typeof moduleIdSchema>;

export interface EnvVarDefinition {
  key: string;
  description: string;
  required: boolean;
  example?: string;
}

export interface ScaffoldFile {
  source: string;
  target: string;
  optional?: boolean;
}

export interface ModuleManifest {
  id: ModuleId;
  name: string;
  version: string;
  description: string;
  dependencies?: ModuleId[];
  npmPackage: string;
  envVars: EnvVarDefinition[];
  scaffoldFiles: ScaffoldFile[];
  configImport: string;
  configFactory: string;
}

export interface ModuleConfigEntry {
  id: ModuleId;
  options: Record<string, unknown>;
}

export interface GenesisConfig {
  modules: ModuleConfigEntry[];
}

export function defineGenesisConfig(config: GenesisConfig): GenesisConfig {
  return config;
}

export function defineModule<T extends Record<string, unknown>>(
  id: ModuleId,
  options: T,
): ModuleConfigEntry {
  return { id, options };
}

export function resolveModuleOrder(
  moduleIds: ModuleId[],
  manifests: ModuleManifest[],
): ModuleId[] {
  const manifestMap = new Map(manifests.map((m) => [m.id, m]));
  const visited = new Set<ModuleId>();
  const result: ModuleId[] = [];

  function visit(id: ModuleId) {
    if (visited.has(id)) return;
    visited.add(id);

    const manifest = manifestMap.get(id);
    if (manifest?.dependencies) {
      for (const dep of manifest.dependencies) {
        if (moduleIds.includes(dep)) {
          visit(dep);
        }
      }
    }

    result.push(id);
  }

  for (const id of moduleIds) {
    visit(id);
  }

  return result;
}

export function validateEnvVars(
  envVars: EnvVarDefinition[],
  env: Record<string, string | undefined>,
): { valid: boolean; missing: string[] } {
  const missing = envVars
    .filter((v) => v.required && !env[v.key])
    .map((v) => v.key);

  return { valid: missing.length === 0, missing };
}

export function createEnvSchema(envVars: EnvVarDefinition[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const envVar of envVars) {
    shape[envVar.key] = envVar.required
      ? z.string().min(1, `${envVar.key} is required`)
      : z.string().optional();
  }

  return z.object(shape);
}

export interface CompatibilityEntry {
  moduleId: ModuleId;
  minCoreVersion: string;
  maxCoreVersion?: string;
}

export const COMPATIBILITY_MATRIX: CompatibilityEntry[] = [
  { moduleId: "auth", minCoreVersion: "0.1.0" },
  { moduleId: "branding", minCoreVersion: "0.1.0" },
  { moduleId: "payments", minCoreVersion: "0.1.0" },
  { moduleId: "dashboard", minCoreVersion: "0.1.0" },
  { moduleId: "notifications", minCoreVersion: "0.1.0" },
  { moduleId: "emails", minCoreVersion: "0.1.0" },
  { moduleId: "uploads", minCoreVersion: "0.1.0" },
  { moduleId: "analytics", minCoreVersion: "0.1.0" },
];

export function isCompatible(moduleId: ModuleId, coreVersion: string): boolean {
  const entry = COMPATIBILITY_MATRIX.find((e) => e.moduleId === moduleId);
  if (!entry) return true;

  return compareVersions(coreVersion, entry.minCoreVersion) >= 0;
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }

  return 0;
}

export class ModuleRegistry {
  private manifests = new Map<ModuleId, ModuleManifest>();

  register(manifest: ModuleManifest): void {
    this.manifests.set(manifest.id, manifest);
  }

  get(id: ModuleId): ModuleManifest | undefined {
    return this.manifests.get(id);
  }

  getAll(): ModuleManifest[] {
    return Array.from(this.manifests.values());
  }

  resolveOrder(moduleIds: ModuleId[]): ModuleId[] {
    return resolveModuleOrder(moduleIds, this.getAll());
  }
}

export const globalRegistry = new ModuleRegistry();

export function loadManifest(manifest: ModuleManifest): ModuleManifest {
  globalRegistry.register(manifest);
  return manifest;
}

export * from "./registry.js";
