import { z } from "zod";
import { createHmac } from "crypto";
import type { Filter } from "mongodb";
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

  async findRecent(
    filter: Partial<TransactionDocument> = {},
    limit = 100,
  ): Promise<TransactionDocument[]> {
    return this.collection
      .find(filter as Filter<TransactionDocument>)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray() as Promise<TransactionDocument[]>;
  }
}

export interface InitializePaymentInput {
  email: string;
  amount: number;
  reference: string;
  currency?: string;
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
  private fetchTimeoutMs = 30_000;

  constructor(
    private secretKey: string,
    public publicKey: string,
  ) {}

  private async fetchPaystack(path: string, init?: RequestInit): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await fetch(`${this.baseUrl}${path}`, {
          ...init,
          signal: AbortSignal.timeout(this.fetchTimeoutMs),
        });
      } catch (error) {
        lastError = error;
        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    throw lastError;
  }

  async initializePayment(input: InitializePaymentInput): Promise<PaystackInitializeResponse> {
    const currency = input.currency ?? "NGN";
    const response = await this.fetchPaystack("/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amount * 100,
        currency,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
    });

    return response.json() as Promise<PaystackInitializeResponse>;
  }

  async verifyPayment(reference: string) {
    const response = await this.fetchPaystack(`/transaction/verify/${reference}`, {
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

  async initialize(
    userId: string,
    email: string,
    amount: number,
    currency: string,
    options: { callbackUrl?: string; metadata?: Record<string, unknown> } = {},
  ) {
    const reference = generateReference();
    const { callbackUrl, metadata } = options;

    await this.transactions.create({
      userId,
      reference,
      amount,
      currency,
      status: "pending",
      provider: "paystack",
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as TransactionDocument);

    return this.paystack.initializePayment({
      email,
      amount,
      reference,
      currency,
      callbackUrl,
      metadata,
    });
  }

  async verify(reference: string) {
    const transaction = await this.transactions.findByReference(reference);

    try {
      const result = await this.paystack.verifyPayment(reference);

      if (transaction) {
        const status = result.data?.status === "success" ? "success" : "failed";
        await this.transactions.update(String(transaction._id), {
          status,
          updatedAt: new Date(),
        } as Partial<TransactionDocument>);
      }

      return { result, transaction: transaction ?? (await this.transactions.findByReference(reference)) };
    } catch (error) {
      const current = transaction ?? (await this.transactions.findByReference(reference));

      if (current?.status === "success") {
        return {
          result: { data: { status: "success" } },
          transaction: current,
          verifyWarning: "Paystack API unreachable; using local success status.",
        };
      }

      throw error;
    }
  }

  async getHistory(userId: string) {
    return this.transactions.findByUserId(userId);
  }

  async listTransactions(options: { status?: TransactionDocument["status"]; limit?: number } = {}) {
    const filter = options.status ? ({ status: options.status } as Partial<TransactionDocument>) : {};
    return this.transactions.findRecent(filter, options.limit ?? 100);
  }

  async getSummary() {
    const transactions = await this.transactions.findRecent({}, 500);
    const paid = transactions.filter((t) => t.status === "success");

    return {
      paidCount: paid.length,
      pendingCount: transactions.filter((t) => t.status === "pending").length,
      failedCount: transactions.filter((t) => t.status === "failed").length,
      totalRevenue: paid.reduce((sum, t) => sum + t.amount, 0),
    };
  }
}

export function formatMoney(amount: number, currency: string): string {
  if (currency === "GHS") return `GH₵${amount.toLocaleString()}`;
  if (currency === "NGN") return `₦${amount.toLocaleString()}`;
  return `${currency} ${amount.toLocaleString()}`;
}

export * from "./config.js";
