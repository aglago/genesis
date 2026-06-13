import { describe, it, expect } from "vitest";
import { branding, createTheme, generateCssVariables } from "../index.js";

describe("@genesis/branding", () => {
  it("creates branding config", () => {
    const config = branding({ primaryColor: "#ff0000" });
    expect(config.id).toBe("branding");
    expect(config.options.primaryColor).toBe("#ff0000");
  });

  it("generates theme", () => {
    const theme = createTheme({ primaryColor: "#000", logo: "/logo.svg", appName: "Test", fontFamily: "Inter" });
    expect(theme.appName).toBe("Test");
  });

  it("generates css variables", () => {
    const vars = generateCssVariables({ primaryColor: "#000000", logo: "/logo.svg", appName: "Test", fontFamily: "Inter" });
    expect(vars["--primary"]).toBeDefined();
  });
});
