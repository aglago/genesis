import { describe, it, expect } from "vitest";
import { notifications } from "../index.js";

describe("@genesis/notifications", () => {
  it("creates notifications config", () => {
    const config = notifications({ channels: ["in-app"] });
    expect(config.id).toBe("notifications");
  });
});
