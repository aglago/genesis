import { z } from "zod";
import { defineModule } from "@genesis/core";

export const uploadsConfigSchema = z.object({
  provider: z.enum(["cloudinary", "s3"]).default("cloudinary"),
  maxFileSizeMB: z.number().default(10),
  allowedTypes: z.array(z.string()).default(["image/jpeg", "image/png", "image/webp", "application/pdf"]),
});

export type UploadsConfig = z.infer<typeof uploadsConfigSchema>;

export function uploads(options: Partial<UploadsConfig> = {}) {
  return defineModule("uploads", uploadsConfigSchema.parse(options));
}

export default uploads;
