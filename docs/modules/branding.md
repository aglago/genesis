# Branding Module

Logo, color themes, typography, and app metadata.

**Install:** `genesis add branding`

**Package:** `@genesis/branding`

## Configuration

```typescript
import branding from "@genesis/branding/config";

branding({
  primaryColor: "#2563eb",
  appName: "Acme Corp",
  logo: "/logo.svg",
  fontFamily: "Inter, sans-serif",
});
```

## Environment Variables

None required.

## Layout Provider

Wrap your layout with the scaffolded provider (the CLI wires this automatically on `create` / `add branding`):

```tsx
// app/layout.tsx — server component passes config; client provider applies CSS vars
import { BrandingProvider } from "@/components/genesis/branding-provider";
import genesisConfig from "../genesis.config";
import type { BrandingConfig } from "@genesis/branding";

const brandingModule = genesisConfig.modules.find((m) => m.id === "branding");
const brandingConfig = (brandingModule?.options ?? {
  primaryColor: "#000000",
  logo: "/logo.svg",
  appName: "My App",
  fontFamily: "Inter, sans-serif",
}) as BrandingConfig;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BrandingProvider config={brandingConfig}>{children}</BrandingProvider>
      </body>
    </html>
  );
}
```

Do **not** import `genesis.config` inside the client `BrandingProvider` — that causes client-side runtime errors in Next.js.

## Metadata Helper

```typescript
import { createMetadata } from "@genesis/branding";

export const metadata = createMetadata({
  primaryColor: "#000",
  logo: "/logo.svg",
  appName: "Acme",
  fontFamily: "Inter, sans-serif",
});
```

## CSS Variables

```typescript
import { generateCssVariables } from "@genesis/branding";

const vars = generateCssVariables({
  primaryColor: "#2563eb",
  logo: "/logo.svg",
  appName: "Acme",
  fontFamily: "Inter, sans-serif",
});
// { "--primary": "...", "--font-family": "..." }
```

## See Also

- [Configuration](../configuration.md)
- [Workflows — Portfolio site](../workflows.md#1-portfolio--marketing-site-no-auth)
