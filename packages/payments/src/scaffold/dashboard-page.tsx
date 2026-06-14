import Link from "next/link";
import { StatCards, type StatCard } from "@genesis/dashboard";
import { connectDatabase } from "@genesis/database";
import { PaystackClient, PaymentService, formatMoney } from "@genesis/payments";
import { getPaymentsCurrency } from "@/lib/payments-config";

async function getPaymentStats(): Promise<StatCard[]> {
  const currency = getPaymentsCurrency();

  try {
    await connectDatabase();
    const paystack = new PaystackClient(
      process.env.PAYSTACK_SECRET_KEY!,
      process.env.PAYSTACK_PUBLIC_KEY!,
    );
    const service = new PaymentService(paystack);
    const summary = await service.getSummary();

    return [
      {
        title: "Orders fulfilled",
        value: summary.paidCount,
        description: "Completed purchases",
      },
      {
        title: "Revenue",
        value: formatMoney(summary.totalRevenue, currency),
        description: "Gross sales to date",
      },
      {
        title: "Pending",
        value: summary.pendingCount,
        description: "Awaiting payment",
      },
      {
        title: "Failed",
        value: summary.failedCount,
        description: "Unsuccessful checkouts",
      },
    ];
  } catch {
    return [
      { title: "Orders fulfilled", value: "—", description: "Completed purchases" },
      { title: "Revenue", value: "—", description: "Gross sales to date" },
      { title: "Pending", value: "—", description: "Awaiting payment" },
      { title: "Failed", value: "—", description: "Unsuccessful checkouts" },
    ];
  }
}

export default async function DashboardPage() {
  const stats = await getPaymentStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Overview</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Track sales and fulfillment at a glance.
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          View all orders
        </Link>
      </div>
      <StatCards stats={stats} />
    </div>
  );
}
