import { Card, CardHeader, CardTitle, CardContent } from "@genesis/ui";
import type { StatCard } from "../index.js";

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && <p className="text-xs text-muted-foreground">{stat.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
