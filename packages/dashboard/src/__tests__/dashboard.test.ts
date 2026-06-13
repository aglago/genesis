import { describe, it, expect } from "vitest";
import { dashboard, getDefaultStats, getNavItems } from "../index.js";

describe("@genesis/dashboard", () => {
  it("creates dashboard config", () => {
    const config = dashboard({ title: "Admin" });
    expect(config.id).toBe("dashboard");
    expect(config.options.title).toBe("Admin");
  });

  it("returns default stats", () => {
    expect(getDefaultStats()).toHaveLength(4);
  });

  it("returns nav items", () => {
    const items = getNavItems({ title: "Dashboard", navItems: [{ label: "Home", href: "/" }] });
    expect(items).toHaveLength(1);
  });
});
