import { z } from "zod";
import { defineModule } from "@genesis/core";

export const dashboardConfigSchema = z.object({
  title: z.string().default("Dashboard"),
  navItems: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([
      { label: "Overview", href: "/dashboard" },
      { label: "Users", href: "/dashboard/users" },
      { label: "Settings", href: "/dashboard/settings" },
    ]),
});

export type DashboardConfig = z.infer<typeof dashboardConfigSchema>;

export function dashboard(options: Partial<DashboardConfig> = {}) {
  return defineModule("dashboard", dashboardConfigSchema.parse(options));
}

export default dashboard;
