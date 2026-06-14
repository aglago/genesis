import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@genesis/ui";
import { connectDatabase, type TransactionDocument } from "@genesis/database";
import { PaystackClient, PaymentService, formatMoney } from "@genesis/payments";

function formatProductLabel(metadata?: Record<string, unknown>) {
  if (!metadata) return "—";
  const name = metadata.productName;
  return typeof name === "string" ? name : "—";
}

function formatStatus(status: TransactionDocument["status"]) {
  if (status === "success") return "Paid";
  if (status === "failed") return "Failed";
  return "Pending";
}

function statusClass(status: TransactionDocument["status"]) {
  if (status === "success") return "text-green-600 dark:text-green-400";
  if (status === "failed") return "text-destructive";
  return "text-muted-foreground";
}

export default async function OrdersPage() {
  let orders: TransactionDocument[] = [];
  let error: string | null = null;

  try {
    await connectDatabase();
    const paystack = new PaystackClient(
      process.env.PAYSTACK_SECRET_KEY!,
      process.env.PAYSTACK_PUBLIC_KEY!,
    );
    const service = new PaymentService(paystack);
    orders = await service.listTransactions();
  } catch {
    error = "Unable to load orders right now.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Recent purchases from your storefront.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {error ? (
            <p className="text-sm text-muted-foreground">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No orders yet. Sales from your storefront will appear here.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={String(order._id ?? order.reference)}>
                    <TableCell className="font-mono text-xs">{order.reference.slice(-8).toUpperCase()}</TableCell>
                    <TableCell>{formatProductLabel(order.metadata)}</TableCell>
                    <TableCell>{formatMoney(order.amount, order.currency)}</TableCell>
                    <TableCell className={statusClass(order.status)}>{formatStatus(order.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
