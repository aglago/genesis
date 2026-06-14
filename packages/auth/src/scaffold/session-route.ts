import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@genesis/auth";
import { connectDatabase } from "@genesis/database";

function createAuthService() {
  return new AuthService({
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    requireEmailVerification: true,
  });
}

export async function GET(request: NextRequest) {
  try {
    await connectDatabase();
    const token = request.cookies.get("genesis_token")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const authService = createAuthService();
    const user = await authService.getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name ?? null,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
