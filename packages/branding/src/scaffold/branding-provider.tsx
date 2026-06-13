"use client";

import type { ReactNode } from "react";
import { createTheme, generateCssVariables } from "@genesis/branding";
import genesisConfig from "../../genesis.config";

const brandingModule = genesisConfig.modules.find((m) => m.id === "branding");
const config = brandingModule?.options ?? { primaryColor: "#000000", appName: "My App" };
const theme = createTheme(config as Parameters<typeof createTheme>[0]);
const cssVars = generateCssVariables(config as Parameters<typeof generateCssVariables>[0]);

export function BrandingProvider({ children }: { children: ReactNode }) {
  return (
    <div style={cssVars as React.CSSProperties} data-app-name={theme.appName}>
      {children}
    </div>
  );
}
