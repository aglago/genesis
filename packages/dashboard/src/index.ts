import type { DashboardConfig } from "./config.js";

export interface StatCard {
  title: string;
  value: string | number;
  description?: string;
}

export function getDefaultStats(): StatCard[] {
  return [
    { title: "Total Users", value: "—", description: "Connect @genesis/analytics for live data" },
    { title: "Revenue", value: "—", description: "Connect @genesis/payments for live data" },
    { title: "Active Sessions", value: "—", description: "Connect @genesis/analytics for live data" },
    { title: "Notifications", value: "—", description: "Connect @genesis/notifications for live data" },
  ];
}

export function getNavItems(config: DashboardConfig) {
  return config.navItems;
}

export * from "./config.js";
export * from "./components/stat-cards.js";
export * from "./components/dashboard-shell.js";
