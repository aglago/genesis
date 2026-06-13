# Emails Module

Transactional email via Resend (primary) or SendGrid.

**Install:** `genesis add emails`

**Package:** `@genesis/emails`

## Configuration

```typescript
import emails from "@genesis/emails/config";

emails({
  provider: "resend",
  fromEmail: "noreply@myapp.com",
  fromName: "My App",
});
```

## Environment Variables

```env
RESEND_API_KEY=re_...
# Or for SendGrid:
# SENDGRID_API_KEY=SG....
```

## Send Emails

```typescript
import { createEmailProvider, EmailService } from "@genesis/emails";

const provider = createEmailProvider(
  "resend",
  process.env.RESEND_API_KEY!,
  "noreply@myapp.com",
);

const emails = new EmailService(provider);

await emails.sendWelcome("user@example.com", "Jane", "Acme");
await emails.sendVerification("user@example.com", "https://myapp.com/verify-email?token=abc");
await emails.sendPasswordReset("user@example.com", "https://myapp.com/reset?token=xyz");
```

## Custom Template

```typescript
await emails.sendTemplate("user@example.com", "custom", {
  subject: "Your invoice is ready",
  html: "<p>View your invoice at ...</p>",
});
```

## Integration with Auth

Wire emails into auth flows after both modules are installed:

```typescript
// After registration
await emails.sendVerification(user.email, `${baseUrl}/verify-email?token=${verificationToken}`);

// After password reset request
await emails.sendPasswordReset(user.email, `${baseUrl}/reset?token=${resetToken}`);
```

## See Also

- [Auth module](auth.md)
- [Configuration](../configuration.md)
