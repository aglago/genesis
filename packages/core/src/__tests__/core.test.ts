import { describe, it, expect } from "vitest";
import {
  defineGenesisConfig,
  defineModule,
  resolveModuleOrder,
  validateEnvVars,
  isCompatible,
  ModuleRegistry,
} from "../index.js";
import type { ModuleManifest } from "../index.js";

describe("@genesis/core", () => {
  it("defines genesis config", () => {
    const config = defineGenesisConfig({
      modules: [defineModule("auth", { providers: ["email"] })],
    });

    expect(config.modules).toHaveLength(1);
    expect(config.modules[0].id).toBe("auth");
  });

  it("resolves module dependency order", () => {
    const manifests: ModuleManifest[] = [
      {
        id: "dashboard",
        name: "Dashboard",
        version: "0.1.0",
        description: "",
        dependencies: ["auth"],
        npmPackage: "@genesis/dashboard",
        envVars: [],
        scaffoldFiles: [],
        configImport: "",
        configFactory: "dashboard",
      },
      {
        id: "auth",
        name: "Auth",
        version: "0.1.0",
        description: "",
        npmPackage: "@genesis/auth",
        envVars: [],
        scaffoldFiles: [],
        configImport: "",
        configFactory: "auth",
      },
    ];

    const order = resolveModuleOrder(["dashboard", "auth"], manifests);
    expect(order.indexOf("auth")).toBeLessThan(order.indexOf("dashboard"));
  });

  it("validates env vars", () => {
    const result = validateEnvVars(
      [{ key: "JWT_SECRET", description: "Secret", required: true }],
      {},
    );

    expect(result.valid).toBe(false);
    expect(result.missing).toContain("JWT_SECRET");
  });

  it("checks compatibility", () => {
    expect(isCompatible("auth", "0.1.0")).toBe(true);
    expect(isCompatible("auth", "0.0.1")).toBe(false);
  });

  it("registers modules in registry", () => {
    const registry = new ModuleRegistry();
    registry.register({
      id: "branding",
      name: "Branding",
      version: "0.1.0",
      description: "Branding module",
      npmPackage: "@genesis/branding",
      envVars: [],
      scaffoldFiles: [],
      configImport: "@genesis/branding/config",
      configFactory: "branding",
    });

    expect(registry.get("branding")).toBeDefined();
    expect(registry.getAll()).toHaveLength(1);
  });
});
