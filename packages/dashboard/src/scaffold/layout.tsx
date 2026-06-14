import { DashboardShell } from "@/components/dashboard-shell";
import genesisConfig from "../../genesis.config";

const dashboardModule = genesisConfig.modules.find((m) => m.id === "dashboard");
const config = dashboardModule?.options ?? { title: "Dashboard", navItems: [] };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell config={config as Parameters<typeof DashboardShell>[0]["config"]}>{children}</DashboardShell>;
}
