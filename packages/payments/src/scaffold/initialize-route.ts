import { NextRequest, NextResponse } from "next/server";
import { PaystackClient, PaymentService } from "@genesis/payments";
import { connectDatabase } from "@genesis/database";
import { getPaymentsCurrency } from "@/lib/payments-config";

export async function POST(request: NextRequest) {
  await connectDatabase();
  const body = await request.json();
  const { email, amount, userId, metadata } = body;
  const currency = getPaymentsCurrency();

  const callbackUrl =
    typeof body.callbackUrl === "string"
      ? body.callbackUrl
      : `${request.nextUrl.origin}/payment/callback`;

  const paystack = new PaystackClient(process.env.PAYSTACK_SECRET_KEY!, process.env.PAYSTACK_PUBLIC_KEY!);
  const service = new PaymentService(paystack);
  const result = await service.initialize(userId, email, amount, currency, {
    callbackUrl,
    metadata,
  });

  return NextResponse.json(result);
}
