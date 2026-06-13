"use client";

import { useEffect, useState } from "react";
import { Button } from "@genesis/ui";

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifications?count=true")
      .then((res) => res.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => {});
  }, []);

  return (
    <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/notifications")}>
      Notifications {count > 0 && `(${count})`}
    </Button>
  );
}
