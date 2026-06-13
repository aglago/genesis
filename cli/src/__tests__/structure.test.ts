import { describe, it, expect } from "vitest";
import { parseStructure, resolveAppDir } from "../utils/structure.js";

describe("structure utils", () => {
  it("parses structure values", () => {
    expect(parseStructure()).toBe("monolith");
    expect(parseStructure("monolith")).toBe("monolith");
    expect(parseStructure("monorepo")).toBe("monorepo");
  });

  it("rejects invalid structure", () => {
    expect(() => parseStructure("microservices")).toThrow(/Invalid structure/);
  });

  it("resolves app directory", () => {
    expect(resolveAppDir("/tmp/my-app", "monolith")).toBe("/tmp/my-app");
    expect(resolveAppDir("/tmp/my-app", "monorepo")).toBe("/tmp/my-app/apps/web");
  });
});
