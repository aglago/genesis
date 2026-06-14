import { NextRequest, NextResponse } from "next/server";
import { AuthService, registerSchema, loginSchema, buildVerifyUrl, sendVerificationEmail } from "@genesis/auth";
import { connectDatabase } from "@genesis/database";

function createAuthService() {
  return new AuthService({
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    requireEmailVerification: true,
  });
}

function databaseErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  const isConnectionError =
    message.includes("ECONNREFUSED") ||
    message.includes("connect") ||
    message.includes("MongoServerSelectionError");

  return NextResponse.json(
    {
      error: isConnectionError
        ? "Database unavailable. Start MongoDB locally or check MONGODB_URI in .env"
        : message,
    },
    { status: isConnectionError ? 503 : 400 },
  );
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ genesis: string[] }> }) {
  try {
    await connectDatabase();
    const { genesis } = await params;
    const action = genesis?.[0];
    const body = await request.json();
    const authService = createAuthService();

    switch (action) {
      case "register": {
        const input = registerSchema.parse(body);
        const result = await authService.register(input);
        const verifyUrl = buildVerifyUrl(request, result.verificationToken ?? "");
        const emailSent = result.verificationToken
          ? await sendVerificationEmail(input.email, verifyUrl)
          : false;

        if (!emailSent && result.verificationToken && process.env.NODE_ENV === "development") {
          console.log(`[genesis/auth] Verification link for ${input.email}: ${verifyUrl}`);
        }

        return NextResponse.json({
          success: true,
          userId: result.user._id,
          emailSent,
          ...(process.env.NODE_ENV === "development" && !emailSent && result.verificationToken
            ? { verifyUrl }
            : {}),
        });
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
    return databaseErrorResponse(error);
  }
}
