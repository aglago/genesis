import { StatCards, getDefaultStats } from "@genesis/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Welcome back. Connect analytics and payments modules for live metrics.
        </p>
      </div>
      <StatCards stats={getDefaultStats()} />
    </div>
  );
}
