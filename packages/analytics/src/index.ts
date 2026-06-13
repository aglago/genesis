import { BaseRepository, getDb } from "@genesis/database";
import type { Document } from "mongodb";

export interface AnalyticsEventDocument extends Document {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

export class AnalyticsRepository extends BaseRepository<AnalyticsEventDocument> {
  constructor() {
    super("analytics_events");
  }
}

export class AnalyticsService {
  private repo = new AnalyticsRepository();

  async track(name: string, properties?: Record<string, unknown>, userId?: string) {
    return this.repo.create({
      name,
      properties,
      userId,
      timestamp: new Date(),
    } as AnalyticsEventDocument);
  }

  async getEventCount(name?: string, since?: Date): Promise<number> {
    const filter: Record<string, unknown> = {};
    if (name) filter.name = name;
    if (since) filter.timestamp = { $gte: since };

    const db = getDb();
    return db.collection("analytics_events").countDocuments(filter);
  }

  async getDashboardMetrics() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const db = getDb();

    const [totalEvents, recentEvents, uniqueUsers] = await Promise.all([
      this.repo.count(),
      db.collection("analytics_events").countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      db.collection("analytics_events").distinct("userId", { userId: { $exists: true } }),
    ]);

    return {
      totalEvents,
      recentEvents,
      activeUsers: uniqueUsers.length,
      revenue: "—",
    };
  }
}

export * from "./config.js";
