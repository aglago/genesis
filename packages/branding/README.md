# @genesis/branding

Logo, color themes, typography, and app metadata for Genesis projects.

## Install

```bash
genesis add branding
```

## Configuration

```typescript
import branding from "@genesis/branding/config";

export default defineGenesisConfig({
  modules: [
    branding({
      primaryColor: "#000000",
      logo: "/logo.svg",
      appName: "My App",
    }),
  ],
});
```

## Exports

- `BrandingProvider` — React context wrapper (scaffolded)
- `createTheme()` — Generate theme object from config
- `generateCssVariables()` — CSS custom properties for Tailwind
- `createMetadata()` — Next.js metadata helper
