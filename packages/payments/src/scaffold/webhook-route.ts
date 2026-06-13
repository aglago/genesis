import { NextRequest, NextResponse } from "next/server";
import { PaystackClient, PaymentService } from "@genesis/payments";
import { connectDatabase } from "@genesis/database";

export async function POST(request: NextRequest) {
  await connectDatabase();
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";

  const paystack = new PaystackClient(process.env.PAYSTACK_SECRET_KEY!, process.env.PAYSTACK_PUBLIC_KEY!);
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET ?? process.env.PAYSTACK_SECRET_KEY!;

  if (!paystack.verifyWebhookSignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  if (event.event === "charge.success") {
    const service = new PaymentService(paystack);
    await service.verify(event.data.reference);
  }

  return NextResponse.json({ received: true });
}
