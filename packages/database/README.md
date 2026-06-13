# @genesis/database

MongoDB connection manager and repository pattern for Genesis modules.

## Environment Variables

- `MONGODB_URI` (required)
- `MONGODB_DB_NAME` (default: `genesis`)

## Usage

```typescript
import { connectDatabase, BaseRepository } from "@genesis/database";

await connectDatabase();
```
