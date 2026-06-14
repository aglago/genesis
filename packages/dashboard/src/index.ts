import type { DashboardConfig } from "./config.js";

export interface StatCard {
  title: string;
  value: string | number;
  description?: string;
}

export function getDefaultStats(): StatCard[] {
  return [
    { title: "Total users", value: "—", description: "Registered accounts" },
    { title: "Revenue", value: "—", description: "Gross sales" },
    { title: "Active sessions", value: "—", description: "Users online now" },
    { title: "Notifications", value: "—", description: "Unread alerts" },
  ];
}

export function isDashboardNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavItems(config: DashboardConfig) {
  return config.navItems;
}

export * from "./config.js";
export * from "./components/stat-cards.js";
export * from "./components/dashboard-shell.js";
