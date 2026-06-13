import { describe, it, expect } from "vitest";
import { emails } from "../index.js";

describe("@genesis/emails", () => {
  it("creates emails config", () => {
    const config = emails({ provider: "resend" });
    expect(config.id).toBe("emails");
  });
});
