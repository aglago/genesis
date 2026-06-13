# Analytics Module

Event tracking abstraction with dashboard widget integration.

**Install:** `genesis add analytics`

**Package:** `@genesis/analytics`

## Configuration

```typescript
import analytics from "@genesis/analytics/config";

analytics({
  trackPageViews: true,
  trackEvents: true,
});
```

## Environment Variables

None required (uses MongoDB via `@genesis/database`).

## Track Events

```typescript
import { AnalyticsService } from "@genesis/analytics";
import { connectDatabase } from "@genesis/database";

await connectDatabase();
const analytics = new AnalyticsService();

await analytics.track("page_view", { path: "/pricing" }, "user_123");
await analytics.track("signup_completed", { plan: "pro" }, "user_123");
await analytics.track("payment_success", { amount: 5000 }, "user_123");
```

## Dashboard Metrics

```typescript
const metrics = await analytics.getDashboardMetrics();
// {
//   totalEvents: number,
//   recentEvents: number,   // last 30 days
//   activeUsers: number,
//   revenue: "—"            // connect payments for live data
// }
```

## Integrate with Dashboard Stat Cards

Replace placeholder stats in the dashboard overview:

```tsx
import { StatCards } from "@genesis/dashboard";
import { AnalyticsService } from "@genesis/analytics";

const analytics = new AnalyticsService();
const metrics = await analytics.getDashboardMetrics();

const stats = [
  { title: "Total Events", value: metrics.totalEvents },
  { title: "Active Users", value: metrics.activeUsers },
  { title: "Recent Events", value: metrics.recentEvents, description: "Last 30 days" },
];

export default function DashboardPage() {
  return <StatCards stats={stats} />;
}
```

## See Also

- [Dashboard module](dashboard.md)
- [Configuration](../configuration.md)
