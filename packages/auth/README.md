# @genesis/auth

User authentication with registration, login, JWT, password reset, email verification, and RBAC.

## Install

```bash
genesis add auth
```

## Configuration

```typescript
import auth from "@genesis/auth/config";

export default defineGenesisConfig({
  modules: [
    auth({ providers: ["email"], requireEmailVerification: true }),
  ],
});
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | No | Token expiration (default: `7d`) |

## API Routes (scaffolded)

- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `POST /api/auth/verify-email` — Verify email token
- `POST /api/auth/forgot-password` — Request reset
- `POST /api/auth/reset-password` — Reset password
