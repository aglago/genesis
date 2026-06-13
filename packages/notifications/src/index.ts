import { BaseRepository } from "@genesis/database";
import type { NotificationDocument } from "@genesis/database";

export type NotificationChannel = "in-app" | "email" | "sms";

export class NotificationRepository extends BaseRepository<NotificationDocument> {
  constructor() {
    super("notifications");
  }

  async findByUserId(userId: string): Promise<NotificationDocument[]> {
    return this.find({ userId } as Partial<NotificationDocument>);
  }

  async markAsRead(id: string): Promise<boolean> {
    return this.update(id, { read: true } as Partial<NotificationDocument>);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.count({ userId, read: false } as Partial<NotificationDocument>);
  }
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  body: string;
  channel?: NotificationChannel;
}

export class NotificationService {
  private repo = new NotificationRepository();

  async create(input: CreateNotificationInput) {
    return this.repo.create({
      userId: input.userId,
      title: input.title,
      body: input.body,
      read: false,
      channel: input.channel ?? "in-app",
      createdAt: new Date(),
    } as NotificationDocument);
  }

  async getForUser(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async markRead(id: string) {
    return this.repo.markAsRead(id);
  }

  async getUnreadCount(userId: string) {
    return this.repo.getUnreadCount(userId);
  }
}

export * from "./config.js";
export * from "./components/notification-bell.js";
