# Uploads Module

File and image uploads via Cloudinary (primary) or S3.

**Install:** `genesis add uploads`

**Package:** `@genesis/uploads`

## Configuration

```typescript
import uploads from "@genesis/uploads/config";

uploads({
  provider: "cloudinary",
  maxFileSizeMB: 10,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
});
```

## Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Upload Button

```tsx
import { UploadButton } from "@genesis/uploads";

export function ProfileSettings() {
  return (
    <UploadButton onUpload={(url) => console.log("Uploaded:", url)} />
  );
}
```

## Dropzone

```tsx
import { Dropzone } from "@genesis/uploads";

export function AssetUpload() {
  return (
    <Dropzone onUpload={(url) => setAvatarUrl(url)} />
  );
}
```

## API Route (scaffolded)

`POST /api/uploads` — accepts `multipart/form-data` with a `file` field.

## File Validation (server)

```typescript
import { validateFile } from "@genesis/uploads";

const result = validateFile(
  file.type,
  file.size,
  ["image/jpeg", "image/png"],
  10, // max MB
);

if (!result.valid) {
  return Response.json({ error: result.error }, { status: 400 });
}
```

## See Also

- [Configuration](../configuration.md)
- [Dashboard module](dashboard.md) — use uploads in admin asset management
