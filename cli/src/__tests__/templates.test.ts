import { describe, it, expect } from "vitest";
import {
  getTemplateDefinition,
  resolveModulesFromFlag,
  mergeTemplateModules,
  getSelectableModulesForTemplate,
} from "../utils/templates.js";

describe("template definitions", () => {
  it("informational-site requires branding and excludes auth", () => {
    const def = getTemplateDefinition("informational-site");
    expect(def.requiredModules).toEqual(["branding"]);
    expect(def.excludedModules).toContain("auth");
    expect(def.excludedModules).toContain("payments");
  });

  it("saas-app includes notifications per PRD", () => {
    const def = getTemplateDefinition("saas-app");
    expect(def.requiredModules).toContain("notifications");
    expect(def.requiredModules).toContain("auth");
  });

  it("custom allows free choice", () => {
    expect(getTemplateDefinition("custom").freeChoice).toBe(true);
  });

  it("merges required modules when customizing", () => {
    const result = mergeTemplateModules("informational-site", ["branding", "emails"]);
    expect(result).toEqual(["branding", "emails"]);
  });

  it("blocks excluded modules when customizing", () => {
    const result = mergeTemplateModules("informational-site", ["branding", "auth"]);
    expect(result).toEqual(["branding"]);
  });

  it("resolveModulesFromFlag always includes required", () => {
    const result = resolveModulesFromFlag("ecommerce", ["auth"]);
    expect(result).toContain("payments");
    expect(result).toContain("dashboard");
    expect(result).toContain("auth");
  });

  it("resolveModulesFromFlag filters excluded on informational", () => {
    const result = resolveModulesFromFlag("informational-site", ["auth", "emails"]);
    expect(result).toEqual(["branding", "emails"]);
  });

  it("getSelectableModulesForTemplate hides excluded", () => {
    const selectable = getSelectableModulesForTemplate("informational-site", [
      "auth",
      "branding",
      "emails",
      "payments",
    ]);
    expect(selectable).toContain("branding");
    expect(selectable).toContain("emails");
    expect(selectable).not.toContain("auth");
    expect(selectable).not.toContain("payments");
  });
});
