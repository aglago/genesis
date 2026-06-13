import { NextRequest, NextResponse } from "next/server";
import { PaystackClient, PaymentService } from "@genesis/payments";
import { connectDatabase } from "@genesis/database";

export async function POST(request: NextRequest) {
  await connectDatabase();
  const { email, amount, userId } = await request.json();

  const paystack = new PaystackClient(process.env.PAYSTACK_SECRET_KEY!, process.env.PAYSTACK_PUBLIC_KEY!);
  const service = new PaymentService(paystack);
  const result = await service.initialize(userId, email, amount, "NGN");

  return NextResponse.json(result);
}
