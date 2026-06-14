import { Card, CardHeader, CardTitle, CardContent } from "@genesis/ui";
import type { StatCard } from "../index.js";

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight sm:text-3xl">{stat.value}</div>
            {stat.description && (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
