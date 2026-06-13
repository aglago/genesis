"use client";

import type { ReactNode } from "react";
import type { BrandingConfig } from "@genesis/branding";
import { createTheme, generateCssVariables } from "@genesis/branding";

const defaultConfig: BrandingConfig = {
  primaryColor: "#000000",
  logo: "/logo.svg",
  appName: "My App",
  fontFamily: "Inter, sans-serif",
};

export function BrandingProvider({
  children,
  config = defaultConfig,
}: {
  children: ReactNode;
  config?: BrandingConfig;
}) {
  const theme = createTheme(config);
  const cssVars = generateCssVariables(config);

  return (
    <div style={cssVars as React.CSSProperties} data-app-name={theme.appName}>
      {children}
    </div>
  );
}
