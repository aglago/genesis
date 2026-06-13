import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  return NextResponse.json({
    templates: ["welcome", "password-reset", "verification", "custom"],
  });
}
