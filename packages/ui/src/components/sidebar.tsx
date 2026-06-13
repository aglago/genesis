import { cn } from "../index.js";
import type { HTMLAttributes, ReactNode } from "react";

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <aside
      className={cn("flex h-full w-64 flex-col border-r bg-card text-card-foreground", className)}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-14 items-center border-b px-4", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto p-4", className)} {...props} />;
}

export function SidebarNav({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <nav className={cn("flex flex-col gap-1", className)} {...props} />;
}

export interface SidebarNavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  href: string;
}

export function SidebarNavItem({ className, active, ...props }: SidebarNavItemProps) {
  return (
    <a
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t p-4", className)} {...props} />;
}
