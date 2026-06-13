import { describe, it, expect } from "vitest";
import { databaseEnvSchema } from "../index.js";

describe("@genesis/database", () => {
  it("validates database env schema", () => {
    const result = databaseEnvSchema.safeParse({
      MONGODB_URI: "mongodb://localhost:27017",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.MONGODB_DB_NAME).toBe("genesis");
    }
  });

  it("requires MONGODB_URI", () => {
    const result = databaseEnvSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
