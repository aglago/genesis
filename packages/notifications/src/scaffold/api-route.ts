import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@genesis/notifications";
import { connectDatabase } from "@genesis/database";

export async function GET(request: NextRequest) {
  await connectDatabase();
  const userId = request.nextUrl.searchParams.get("userId") ?? "demo";
  const countOnly = request.nextUrl.searchParams.get("count") === "true";

  const service = new NotificationService();

  if (countOnly) {
    const count = await service.getUnreadCount(userId);
    return NextResponse.json({ count });
  }

  const notifications = await service.getForUser(userId);
  return NextResponse.json({ notifications });
}

export async function POST(request: NextRequest) {
  await connectDatabase();
  const body = await request.json();
  const service = new NotificationService();
  const notification = await service.create(body);
  return NextResponse.json({ notification });
}

export async function PATCH(request: NextRequest) {
  await connectDatabase();
  const { id } = await request.json();
  const service = new NotificationService();
  await service.markRead(id);
  return NextResponse.json({ success: true });
}
