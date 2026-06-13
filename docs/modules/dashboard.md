# Dashboard Module

Admin sidebar, analytics stat cards, user management tables, and settings pages.

**Install:** `genesis add dashboard`

**Package:** `@genesis/dashboard`

**Depends on:** `@genesis/auth` (for protected admin routes)

## Configuration

```typescript
import dashboard from "@genesis/dashboard/config";

dashboard({
  title: "Admin Panel",
  navItems: [
    { label: "Overview", href: "/dashboard" },
    { label: "Users", href: "/dashboard/users" },
    { label: "Settings", href: "/dashboard/settings" },
  ],
});
```

## Environment Variables

None required.

## Scaffolded Routes

| Route | Page |
|-------|------|
| `/dashboard` | Overview with stat cards |
| `/dashboard/users` | User management table |
| `/dashboard/settings` | General settings form |

## Custom Admin Page

```tsx
import { DashboardShell, StatCards, getDefaultStats } from "@genesis/dashboard";
import genesisConfig from "../../genesis.config";

const config = genesisConfig.modules.find((m) => m.id === "dashboard")!.options;

export default function CustomAdminPage() {
  return (
    <DashboardShell config={config as Parameters<typeof DashboardShell>[0]["config"]}>
      <StatCards stats={getDefaultStats()} />
    </DashboardShell>
  );
}
```

## Stat Cards

Placeholder metrics are shown until `@genesis/analytics` and `@genesis/payments` are connected:

```typescript
import { getDefaultStats } from "@genesis/dashboard";

const stats = getDefaultStats();
// [{ title: "Total Users", value: "—", ... }, ...]
```

## See Also

- [Auth module](auth.md) — required dependency
- [Analytics module](analytics.md) — live dashboard metrics
