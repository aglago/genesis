import { z } from "zod";
import { defineModule } from "@genesis/core";

export const analyticsConfigSchema = z.object({
  trackPageViews: z.boolean().default(true),
  trackEvents: z.boolean().default(true),
});

export type AnalyticsConfig = z.infer<typeof analyticsConfigSchema>;

export function analytics(options: Partial<AnalyticsConfig> = {}) {
  return defineModule("analytics", analyticsConfigSchema.parse(options));
}

export default analytics;
