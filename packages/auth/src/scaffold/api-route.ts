import { NextRequest, NextResponse } from "next/server";
import { AuthService, registerSchema, loginSchema } from "@genesis/auth";
import { connectDatabase } from "@genesis/database";

const authService = new AuthService({
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  requireEmailVerification: true,
});

export async function POST(request: NextRequest, { params }: { params: { genesis: string[] } }) {
  await connectDatabase();
  const action = params.genesis?.[0];
  const body = await request.json();

  try {
    switch (action) {
      case "register": {
        const input = registerSchema.parse(body);
        const result = await authService.register(input);
        return NextResponse.json({ success: true, userId: result.user._id });
      }
      case "login": {
        const input = loginSchema.parse(body);
        const result = await authService.login(input);
        const response = NextResponse.json({ success: true, user: { email: result.user.email, role: result.user.role } });
        response.cookies.set("genesis_token", result.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
        return response;
      }
      case "verify-email": {
        await authService.verifyEmail(body.token);
        return NextResponse.json({ success: true });
      }
      case "forgot-password": {
        await authService.requestPasswordReset(body.email);
        return NextResponse.json({ success: true });
      }
      case "reset-password": {
        await authService.resetPassword(body.token, body.password);
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
