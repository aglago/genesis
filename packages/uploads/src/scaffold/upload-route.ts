import { NextRequest, NextResponse } from "next/server";
import { createUploadProvider, validateFile } from "@genesis/uploads";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validation = validateFile(file.type, file.size, ["image/jpeg", "image/png", "image/webp", "application/pdf"], 10);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const provider = createUploadProvider("cloudinary", {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await provider.upload(buffer, file.name, file.type);

  return NextResponse.json(result);
}
