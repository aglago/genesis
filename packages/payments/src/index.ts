import { z } from "zod";
import { createHmac } from "crypto";
import { BaseRepository } from "@genesis/database";
import type { TransactionDocument } from "@genesis/database";

export const paymentsEnvSchema = z.object({
  PAYSTACK_SECRET_KEY: z.string().min(1),
  PAYSTACK_PUBLIC_KEY: z.string().min(1),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),
});

export type PaymentsEnv = z.infer<typeof paymentsEnvSchema>;

export class TransactionRepository extends BaseRepository<TransactionDocument> {
  constructor() {
    super("transactions");
  }

  async findByReference(reference: string): Promise<TransactionDocument | null> {
    return this.findOne({ reference } as Partial<TransactionDocument>);
  }

  async findByUserId(userId: string): Promise<TransactionDocument[]> {
    return this.find({ userId } as Partial<TransactionDocument>);
  }
}

export interface InitializePaymentInput {
  email: string;
  amount: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export class PaystackClient {
  private baseUrl = "https://api.paystack.co";

  constructor(
    private secretKey: string,
    public publicKey: string,
  ) {}

  async initializePayment(input: InitializePaymentInput): Promise<PaystackInitializeResponse> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amount * 100,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
    });

    return response.json() as Promise<PaystackInitializeResponse>;
  }

  async verifyPayment(reference: string) {
    const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });

    return response.json();
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const hash = createHmac("sha512", secret).update(payload).digest("hex");
    return hash === signature;
  }
}

export function generateReference(): string {
  return `genesis_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class PaymentService {
  private transactions = new TransactionRepository();

  constructor(private paystack: PaystackClient) {}

  async initialize(userId: string, email: string, amount: number, currency: string) {
    const reference = generateReference();

    await this.transactions.create({
      userId,
      reference,
      amount,
      currency,
      status: "pending",
      provider: "paystack",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as TransactionDocument);

    return this.paystack.initializePayment({ email, amount, reference });
  }

  async verify(reference: string) {
    const result = await this.paystack.verifyPayment(reference);
    const transaction = await this.transactions.findByReference(reference);

    if (transaction) {
      const status = result.data?.status === "success" ? "success" : "failed";
      await this.transactions.update(String(transaction._id), {
        status,
        updatedAt: new Date(),
      } as Partial<TransactionDocument>);
    }

    return { result, transaction };
  }

  async getHistory(userId: string) {
    return this.transactions.findByUserId(userId);
  }
}

export * from "./config.js";
