import { z } from "zod";
import { defineModule } from "@genesis/core";

export const authConfigSchema = z.object({
  providers: z.array(z.enum(["email"])).default(["email"]),
  requireEmailVerification: z.boolean().default(true),
  jwtExpiresIn: z.string().default("7d"),
  roles: z.array(z.enum(["user", "admin"])).default(["user", "admin"]),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;

export function auth(options: Partial<AuthConfig> = {}) {
  return defineModule("auth", authConfigSchema.parse(options));
}

export default auth;
