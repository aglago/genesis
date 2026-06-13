"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@genesis/ui";

interface Notification {
  _id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications?userId=demo")
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications ?? []));
  }, []);

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n._id} className={n.read ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle className="text-base">{n.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{n.body}</p>
              {!n.read && (
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => markRead(n._id)}>
                  Mark as read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
