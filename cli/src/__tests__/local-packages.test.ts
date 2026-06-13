import { describe, it, expect } from "vitest";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { resolveLocalPackageRef, usesLocalPackages } from "../utils/local-packages.js";
import { getGenesisRoot } from "../utils/manifests.js";

describe("local-packages", () => {
  it("resolves file: paths relative to the target app", () => {
    const genesisRoot = getGenesisRoot();
    const targetDir = path.join(genesisRoot, "tmp-test-app");

    const ref = resolveLocalPackageRef(targetDir, "@genesis/branding");
    expect(ref).toBe("file:../packages/branding");
  });

  it("detects file: linked dependencies", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "genesis-local-"));
    await fs.writeJson(path.join(dir, "package.json"), {
      dependencies: {
        "@genesis/core": "file:../packages/core",
        next: "^15.0.0",
      },
    });

    expect(usesLocalPackages(dir)).toBe(true);
    await fs.remove(dir);
  });

  it("returns false when using registry versions", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "genesis-local-"));
    await fs.writeJson(path.join(dir, "package.json"), {
      dependencies: { "@genesis/core": "*" },
    });

    expect(usesLocalPackages(dir)).toBe(false);
    await fs.remove(dir);
  });
});
