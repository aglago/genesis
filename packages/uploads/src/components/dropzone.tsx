"use client";

import { useState, useCallback } from "react";
import { cn } from "@genesis/ui";

export function Dropzone({ onUpload }: { onUpload?: (url: string) => void }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      onUpload?.(data.url);
    },
    [onUpload],
  );

  return (
    <div
      className={cn(
        "flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <p className="text-sm text-muted-foreground">Drop files here or use Upload button</p>
    </div>
  );
}
