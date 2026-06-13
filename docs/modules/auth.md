# Auth Module

User registration, login, JWT authentication, password reset, email verification, and RBAC.

**Install:** `genesis add auth`

**Package:** `@genesis/auth`

## Configuration

```typescript
import auth from "@genesis/auth/config";

auth({
  providers: ["email"],
  requireEmailVerification: true,
  jwtExpiresIn: "7d",
  roles: ["user", "admin"],
});
```

## Environment Variables

```env
JWT_SECRET=your-32-character-minimum-secret-key-here
JWT_EXPIRES_IN=7d
```

## Scaffolded Routes

| Route | Purpose |
|-------|---------|
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Request password reset |
| `/verify-email?token=...` | Verify email address |

## API Endpoints

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123","name":"Jane"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123"}'
```

## AuthService (server)

```typescript
import { AuthService } from "@genesis/auth";
import { connectDatabase } from "@genesis/database";

export async function GET(request: Request) {
  await connectDatabase();

  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const auth = new AuthService({
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  });

  const user = token ? await auth.getUserFromToken(token) : null;
  return Response.json({ user });
}
```

## Protect Routes with Middleware

Genesis scaffolds `middleware.genesis-auth.ts`. Merge into your root `middleware.ts`:

```typescript
import type { NextRequest } from "next/server";
import { authMiddleware } from "./middleware.genesis-auth";

export function middleware(request: NextRequest) {
  return authMiddleware(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

## RBAC

```typescript
import { hasRole } from "@genesis/auth";

if (!hasRole(user.role, "admin")) {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
```

## See Also

- [Configuration](../configuration.md)
- [Emails module](emails.md) — verification and password reset emails
- [Dashboard module](dashboard.md) — requires auth for admin routes
