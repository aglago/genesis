import { describe, it, expect } from "vitest";
import { defineGenesisConfig, defineModule, resolveModuleOrder } from "../index.js";
import type { ModuleManifest } from "../index.js";

describe("Cross-module integration", () => {
  it("composes multiple modules in genesis config", () => {
    const config = defineGenesisConfig({
      modules: [
        defineModule("auth", { providers: ["email"], requireEmailVerification: true }),
        defineModule("emails", { provider: "resend", fromEmail: "noreply@test.com" }),
        defineModule("payments", { provider: "paystack" }),
        defineModule("notifications", { channels: ["in-app"] }),
      ],
    });

    expect(config.modules).toHaveLength(4);
    expect(config.modules.map((m) => m.id)).toEqual(["auth", "emails", "payments", "notifications"]);
  });

  it("resolves dashboard after auth dependency", () => {
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
        configImport: "@genesis/dashboard/config",
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
        configImport: "@genesis/auth/config",
        configFactory: "auth",
      },
    ];

    const order = resolveModuleOrder(["dashboard", "auth"], manifests);
    expect(order.indexOf("auth")).toBeLessThan(order.indexOf("dashboard"));
  });
});
