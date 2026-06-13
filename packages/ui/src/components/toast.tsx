import { cn } from "../index.js";
import type { HTMLAttributes } from "react";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success";
}

const variants = {
  default: "border bg-background text-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground",
  success: "border-green-500 bg-green-50 text-green-900",
};

export function Toast({ className, variant = "default", ...props }: ToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ToastTitle({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm font-semibold", className)} {...props} />;
}

export function ToastDescription({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm opacity-90", className)} {...props} />;
}
