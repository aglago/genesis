import { StatCards, getDefaultStats } from "@genesis/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Welcome back. Here&apos;s a snapshot of your application.
        </p>
      </div>
      <StatCards stats={getDefaultStats()} />
    </div>
  );
}
