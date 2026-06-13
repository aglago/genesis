import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signToken, verifyToken, hasRole, auth } from "../index.js";

describe("@genesis/auth", () => {
  it("hashes and verifies passwords", async () => {
    const hash = await hashPassword("password123");
    expect(await verifyPassword("password123", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("signs and verifies JWT", () => {
    const token = signToken({ userId: "1", email: "test@example.com", role: "user" }, "test-secret-key-minimum-32-chars!!", "1h");
    const payload = verifyToken(token, "test-secret-key-minimum-32-chars!!");
    expect(payload?.email).toBe("test@example.com");
  });

  it("checks roles", () => {
    expect(hasRole("admin", "user")).toBe(true);
    expect(hasRole("user", "admin")).toBe(false);
  });

  it("creates auth config", () => {
    const config = auth({ providers: ["email"] });
    expect(config.id).toBe("auth");
  });
});
