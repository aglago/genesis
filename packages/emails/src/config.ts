import { z } from "zod";
import { defineModule } from "@genesis/core";

export const emailsConfigSchema = z.object({
  provider: z.enum(["resend", "sendgrid"]).default("resend"),
  fromEmail: z.string().email().default("noreply@example.com"),
  fromName: z.string().default("Genesis App"),
});

export type EmailsConfig = z.infer<typeof emailsConfigSchema>;

export function emails(options: Partial<EmailsConfig> = {}) {
  return defineModule("emails", emailsConfigSchema.parse(options));
}

export default emails;
