import { describe, it, expect } from "vitest";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { mergeEnvExample } from "../utils/scaffold.js";
import type { ModuleManifest } from "@genesis/core";

const brandingOnly: ModuleManifest[] = [
  {
    id: "branding",
    name: "Branding",
    version: "0.1.0",
    description: "",
    npmPackage: "@genesis/branding",
    configImport: "@genesis/branding/config",
    configFactory: "branding",
    envVars: [],
    scaffoldFiles: [],
  },
];

const withAuth: ModuleManifest[] = [
  ...brandingOnly,
  {
    id: "auth",
    name: "Auth",
    version: "0.1.0",
    description: "",
    npmPackage: "@genesis/auth",
    configImport: "@genesis/auth/config",
    configFactory: "auth",
    envVars: [{ key: "JWT_SECRET", description: "JWT signing secret", required: true, example: "change-me" }],
    scaffoldFiles: [],
  },
];

describe("mergeEnvExample", () => {
  it("omits MongoDB vars for branding-only projects", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "genesis-env-"));
    await mergeEnvExample(brandingOnly, dir);

    const content = await fs.readFile(path.join(dir, ".env.example"), "utf-8");
    expect(content).not.toContain("MONGODB_URI");

    await fs.remove(dir);
  });

  it("includes local MongoDB defaults when database modules are installed", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "genesis-env-"));
    await mergeEnvExample(withAuth, dir, { dbName: "my-saas" });

    const content = await fs.readFile(path.join(dir, ".env.example"), "utf-8");
    expect(content).toContain("MONGODB_URI=mongodb://localhost:27017/my-saas");
    expect(content).toContain("MONGODB_DB_NAME=my-saas");
    expect(content).toContain("JWT_SECRET=change-me");

    await fs.remove(dir);
  });
});
