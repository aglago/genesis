import type { ModuleId } from "@genesis/core";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  /** Modules always installed for this template. */
  requiredModules: ModuleId[];
  /** Modules the user may add when customizing. */
  optionalModules?: ModuleId[];
  /** Modules hidden/blocked for this template. */
  excludedModules?: ModuleId[];
  /** When true, show the full module picker (custom template only). */
  freeChoice?: boolean;
}

export const TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> = {
  custom: {
    id: "custom",
    name: "Blank (custom)",
    description: "Minimal Next.js app — choose any modules",
    requiredModules: [],
    freeChoice: true,
  },
  "informational-site": {
    id: "informational-site",
    name: "Informational Website",
    description: "Landing page and contact form — no auth or payments",
    requiredModules: ["branding"],
    optionalModules: ["emails", "analytics"],
    excludedModules: ["auth", "payments", "dashboard"],
  },
  "saas-app": {
    id: "saas-app",
    name: "SaaS Starter",
    description: "Auth, billing, admin dashboard, and notifications",
    requiredModules: ["auth", "branding", "payments", "dashboard", "notifications"],
    optionalModules: ["emails", "uploads", "analytics"],
    excludedModules: [],
  },
  ecommerce: {
    id: "ecommerce",
    name: "E-commerce",
    description: "Product catalog, payments, and admin dashboard",
    requiredModules: ["payments", "dashboard"],
    optionalModules: ["auth", "branding", "uploads", "notifications", "analytics"],
    excludedModules: [],
  },
};

export function getTemplateDefinition(templateId: string): TemplateDefinition {
  return TEMPLATE_DEFINITIONS[templateId] ?? TEMPLATE_DEFINITIONS.custom;
}

export function formatModuleList(modules: ModuleId[], labels: Record<string, string>): string {
  if (modules.length === 0) return "none";
  return modules.map((id) => labels[id] ?? id).join(", ");
}

/** Merge CLI -m modules with template required; filter excluded. */
export function resolveModulesFromFlag(
  templateId: string,
  flagModules: ModuleId[],
): ModuleId[] {
  const def = getTemplateDefinition(templateId);

  if (def.freeChoice) {
    return flagModules;
  }

  const filtered = flagModules.filter((m) => !def.excludedModules?.includes(m));
  return [...new Set([...def.requiredModules, ...filtered])];
}

/** Validate customize selection: required always included, excluded removed. */
export function mergeTemplateModules(
  templateId: string,
  selected: ModuleId[],
): ModuleId[] {
  const def = getTemplateDefinition(templateId);
  const filtered = selected.filter((m) => !def.excludedModules?.includes(m));
  return [...new Set([...def.requiredModules, ...filtered])];
}

export function getSelectableModulesForTemplate(
  templateId: string,
  allModuleIds: ModuleId[],
): ModuleId[] {
  const def = getTemplateDefinition(templateId);

  if (def.freeChoice) {
    return allModuleIds;
  }

  const allowed = new Set<ModuleId>([...def.requiredModules, ...(def.optionalModules ?? [])]);
  return allModuleIds.filter(
    (id) => allowed.has(id) && !def.excludedModules?.includes(id),
  );
}
