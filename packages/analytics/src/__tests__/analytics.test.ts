import { describe, it, expect } from "vitest";
import { analytics } from "../index.js";

describe("@genesis/analytics", () => {
  it("creates analytics config", () => {
    const config = analytics({ trackPageViews: true });
    expect(config.id).toBe("analytics");
  });
});
