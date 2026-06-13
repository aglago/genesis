"use client";

import { useState } from "react";
import { Button } from "@genesis/ui";

export function UploadButton({ onUpload }: { onUpload?: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      onUpload?.(data.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="file" id="genesis-upload" className="hidden" onChange={handleChange} />
      <label htmlFor="genesis-upload">
        <Button disabled={uploading} type="button">
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
      </label>
    </div>
  );
}
