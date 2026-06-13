import { describe, it, expect } from "vitest";
import { uploads, validateFile } from "../index.js";

describe("@genesis/uploads", () => {
  it("creates uploads config", () => {
    const config = uploads({ provider: "cloudinary" });
    expect(config.id).toBe("uploads");
  });

  it("validates file types and size", () => {
    expect(validateFile("image/png", 1024, ["image/png"], 10).valid).toBe(true);
    expect(validateFile("application/exe", 1024, ["image/png"], 10).valid).toBe(false);
    expect(validateFile("image/png", 20 * 1024 * 1024, ["image/png"], 10).valid).toBe(false);
  });
});
