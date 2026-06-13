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

Wrap your layout with the scaffolded provider:

```tsx
// app/layout.tsx
import { BrandingProvider } from "@/components/genesis/branding-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BrandingProvider>{children}</BrandingProvider>
      </body>
    </html>
  );
}
```

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
