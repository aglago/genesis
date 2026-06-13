import { NextResponse } from "next/server";

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
}

function validate(body: ContactBody): string | null {
  if (!body.name?.trim()) return "Name is required";
  if (!body.email?.trim() || !body.email.includes("@")) return "Valid email is required";
  if (!body.message?.trim() || body.message.trim().length < 10) {
    return "Message must be at least 10 characters";
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const error = validate(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Placeholder: wire to @genesis/emails or MongoDB when those modules are added.
    console.info("[contact]", {
      name: body.name?.trim(),
      email: body.email?.trim(),
      message: body.message?.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
