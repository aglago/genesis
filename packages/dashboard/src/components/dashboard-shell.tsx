import type { ReactNode } from "react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem, SidebarFooter } from "@genesis/ui";
import type { DashboardConfig } from "../config.js";

/** @deprecated Use the scaffolded `@/components/dashboard-shell` in your app for the full responsive shell. */
export function DashboardShell({
  config,
  children,
  currentPath,
}: {
  config: DashboardConfig;
  children: ReactNode;
  currentPath?: string;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarHeader>
          <span className="font-semibold">{config.title}</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav>
            {config.navItems.map((item) => (
              <SidebarNavItem key={item.href} href={item.href} active={currentPath === item.href}>
                {item.label}
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </SidebarContent>
        <SidebarFooter>
          <span className="text-xs text-muted-foreground">Powered by Genesis</span>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
