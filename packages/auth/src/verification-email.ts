const DEFAULT_FROM = "onboarding@resend.dev";

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const from = process.env.EMAIL_FROM ?? DEFAULT_FROM;

  if (resendKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Verify your email",
        html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
      }),
    });

    return response.ok;
  }

  if (sendgridKey) {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendgridKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject: "Verify your email",
        content: [{ type: "text/html", value: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>` }],
      }),
    });

    return response.ok;
  }

  return false;
}

export function buildVerifyUrl(request: Request, token: string): string {
  const origin = request.headers.get("origin");
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    origin ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return `${baseUrl.replace(/\/$/, "")}/verify-email?token=${token}`;
}
