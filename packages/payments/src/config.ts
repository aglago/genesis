import { z } from "zod";
import { defineModule } from "@genesis/core";

export const paymentsConfigSchema = z.object({
  provider: z.enum(["paystack"]).default("paystack"),
  currency: z.string().default("NGN"),
});

export type PaymentsConfig = z.infer<typeof paymentsConfigSchema>;

export function payments(options: Partial<PaymentsConfig> = {}) {
  return defineModule("payments", paymentsConfigSchema.parse(options));
}

export default payments;
