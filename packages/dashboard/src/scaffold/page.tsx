import { StatCards, getDefaultStats } from "@genesis/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Overview</h1>
      <StatCards stats={getDefaultStats()} />
    </div>
  );
}
