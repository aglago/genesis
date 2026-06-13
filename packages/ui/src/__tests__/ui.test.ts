import { describe, it, expect } from "vitest";
import { cn, genesisTailwindPreset } from "../index.js";

describe("@genesis/ui", () => {
  it("merges class names", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("exports tailwind preset", () => {
    expect(genesisTailwindPreset.theme.extend.colors.primary).toBeDefined();
  });
});
