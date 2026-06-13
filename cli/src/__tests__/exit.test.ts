import { describe, it, expect } from "vitest";
import { isUserCancellation } from "../utils/exit.js";

describe("exit utils", () => {
  it("detects ExitPromptError from inquirer", () => {
    expect(isUserCancellation({ name: "ExitPromptError", message: "User force closed the prompt" })).toBe(true);
  });

  it("detects force closed prompt message", () => {
    expect(isUserCancellation(new Error("User force closed the prompt with 0 null"))).toBe(true);
  });

  it("returns false for regular errors", () => {
    expect(isUserCancellation(new Error("Something broke"))).toBe(false);
    expect(isUserCancellation(null)).toBe(false);
  });
});
