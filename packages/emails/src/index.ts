import { z } from "zod";

export const emailsEnvSchema = z.object({
  RESEND_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
});

export type EmailTemplate = "welcome" | "password-reset" | "verification" | "custom";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  template?: EmailTemplate;
}

export interface EmailProvider {
  send(input: SendEmailInput): Promise<{ id: string }>;
}

export class ResendProvider implements EmailProvider {
  constructor(private apiKey: string, private from: string) {}

  async send(input: SendEmailInput): Promise<{ id: string }> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: input.to,
        subject: input.subject,
        html: input.html,
      }),
    });

    const data = (await response.json()) as { id: string };
    return { id: data.id };
  }
}

export class SendGridProvider implements EmailProvider {
  constructor(private apiKey: string, private from: string) {}

  async send(input: SendEmailInput): Promise<{ id: string }> {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: input.to }] }],
        from: { email: this.from },
        subject: input.subject,
        content: [{ type: "text/html", value: input.html }],
      }),
    });

    return { id: response.headers.get("x-message-id") ?? "sent" };
  }
}

const templates: Record<EmailTemplate, (data: Record<string, string>) => { subject: string; html: string }> = {
  welcome: (data) => ({
    subject: `Welcome to ${data.appName ?? "our app"}!`,
    html: `<h1>Welcome, ${data.name ?? "there"}!</h1><p>Thanks for joining us.</p>`,
  }),
  "password-reset": (data) => ({
    subject: "Reset your password",
    html: `<p>Click <a href="${data.resetUrl}">here</a> to reset your password.</p>`,
  }),
  verification: (data) => ({
    subject: "Verify your email",
    html: `<p>Click <a href="${data.verifyUrl}">here</a> to verify your email.</p>`,
  }),
  custom: (data) => ({
    subject: data.subject ?? "Notification",
    html: data.html ?? "<p>Hello</p>",
  }),
};

export class EmailService {
  constructor(private provider: EmailProvider) {}

  async sendTemplate(to: string, template: EmailTemplate, data: Record<string, string> = {}) {
    const { subject, html } = templates[template](data);
    return this.provider.send({ to, subject, html, template });
  }

  async sendWelcome(to: string, name: string, appName: string) {
    return this.sendTemplate(to, "welcome", { name, appName });
  }

  async sendPasswordReset(to: string, resetUrl: string) {
    return this.sendTemplate(to, "password-reset", { resetUrl });
  }

  async sendVerification(to: string, verifyUrl: string) {
    return this.sendTemplate(to, "verification", { verifyUrl });
  }
}

export function createEmailProvider(
  provider: "resend" | "sendgrid",
  apiKey: string,
  from: string,
): EmailProvider {
  return provider === "resend" ? new ResendProvider(apiKey, from) : new SendGridProvider(apiKey, from);
}

export * from "./config.js";
