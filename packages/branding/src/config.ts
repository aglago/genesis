import { z } from "zod";
import { defineModule } from "@genesis/core";

export const brandingConfigSchema = z.object({
  primaryColor: z.string().default("#000000"),
  logo: z.string().default("/logo.svg"),
  appName: z.string().default("My App"),
  fontFamily: z.string().default("Inter, sans-serif"),
});

export type BrandingConfig = z.infer<typeof brandingConfigSchema>;

export function branding(options: Partial<BrandingConfig> = {}) {
  return defineModule("branding", brandingConfigSchema.parse(options));
}

export default branding;
