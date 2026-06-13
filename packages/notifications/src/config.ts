import { z } from "zod";
import { defineModule } from "@genesis/core";

export const notificationsConfigSchema = z.object({
  channels: z.array(z.enum(["in-app", "email", "sms"])).default(["in-app", "email"]),
});

export type NotificationsConfig = z.infer<typeof notificationsConfigSchema>;

export function notifications(options: Partial<NotificationsConfig> = {}) {
  return defineModule("notifications", notificationsConfigSchema.parse(options));
}

export default notifications;
