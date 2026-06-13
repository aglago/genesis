import { describe, it, expect } from "vitest";
import { loadAllManifests, getManifestById } from "../utils/manifests.js";
import { generateGenesisConfig } from "../utils/scaffold.js";

describe("@genesis/cli", () => {
  it("loads all manifests", async () => {
    const manifests = await loadAllManifests();
    expect(manifests.length).toBeGreaterThanOrEqual(4);
    expect(getManifestById("auth")).toBeDefined();
  });

  it("generates genesis config", () => {
    const config = generateGenesisConfig([
      { id: "auth", configImport: "@genesis/auth/config", configFactory: "auth" },
      { id: "branding", configImport: "@genesis/branding/config", configFactory: "branding" },
    ]);

    expect(config).toContain("defineGenesisConfig");
    expect(config).toContain("auth()");
    expect(config).toContain("branding()");
  });
});
