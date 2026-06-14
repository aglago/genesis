import { NextRequest, NextResponse } from "next/server";
import { PaystackClient, PaymentService } from "@genesis/payments";
import { connectDatabase } from "@genesis/database";

export async function GET(request: NextRequest) {
  await connectDatabase();
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Reference required" }, { status: 400 });
  }

  const paystack = new PaystackClient(process.env.PAYSTACK_SECRET_KEY!, process.env.PAYSTACK_PUBLIC_KEY!);
  const service = new PaymentService(paystack);

  try {
    const result = await service.verify(reference);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("fetch failed")
        ? "Could not reach Paystack to verify this payment. Check your network connection or confirm the order under Dashboard → Orders after the webhook runs."
        : "Payment verification failed.";

    return NextResponse.json({ error: message }, { status: 503 });
  }
}
