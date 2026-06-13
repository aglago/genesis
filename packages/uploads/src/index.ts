import { z } from "zod";

export const uploadsEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

export interface UploadResult {
  url: string;
  publicId?: string;
  size: number;
  mimeType: string;
}

export interface UploadProvider {
  upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
}

export class CloudinaryProvider implements UploadProvider {
  constructor(
    private cloudName: string,
    private apiKey: string,
    private apiSecret: string,
  ) {}

  async upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    const base64 = file.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64}`;

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: dataUri,
          api_key: this.apiKey,
          timestamp: Math.round(Date.now() / 1000),
          public_id: filename.replace(/\.[^.]+$/, ""),
        }),
      },
    );

    const data = (await response.json()) as { secure_url: string; public_id: string; bytes: number };
    return { url: data.secure_url, publicId: data.public_id, size: data.bytes, mimeType };
  }
}

export class S3ProviderStub implements UploadProvider {
  async upload(_file: Buffer, _filename: string, _mimeType: string): Promise<UploadResult> {
    throw new Error("S3 upload provider is not yet fully implemented.");
  }
}

export function validateFile(
  mimeType: string,
  sizeBytes: number,
  allowedTypes: string[],
  maxSizeMB: number,
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(mimeType)) {
    return { valid: false, error: `File type ${mimeType} is not allowed` };
  }
  if (sizeBytes > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File exceeds maximum size of ${maxSizeMB}MB` };
  }
  return { valid: true };
}

export function createUploadProvider(
  provider: "cloudinary" | "s3",
  env: z.infer<typeof uploadsEnvSchema>,
): UploadProvider {
  if (provider === "cloudinary") {
    return new CloudinaryProvider(
      env.CLOUDINARY_CLOUD_NAME!,
      env.CLOUDINARY_API_KEY!,
      env.CLOUDINARY_API_SECRET!,
    );
  }
  return new S3ProviderStub();
}

export * from "./config.js";
export * from "./components/upload-button.js";
export * from "./components/dropzone.js";
