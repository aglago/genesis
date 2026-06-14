import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { BaseRepository } from "@genesis/database";
import type { UserDocument } from "@genesis/database";
import { randomBytes } from "crypto";

export const authEnvSchema = z.object({
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

export type AuthEnv = z.infer<typeof authEnvSchema>;

export interface JwtPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super("users");
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email } as Partial<UserDocument>);
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string, secret: string): JwtPayload | null {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type Role = "user" | "admin";

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  if (requiredRole === "user") return true;
  return userRole === "admin";
}

export interface AuthServiceOptions {
  jwtSecret: string;
  jwtExpiresIn: string;
  requireEmailVerification?: boolean;
}

export class AuthService {
  private users = new UserRepository();

  constructor(private options: AuthServiceOptions) {}

  async register(input: z.infer<typeof registerSchema>) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await hashPassword(input.password);
    const verificationToken = generateToken();

    const user = await this.users.create({
      email: input.email,
      passwordHash,
      name: input.name,
      role: "user",
      emailVerified: !this.options.requireEmailVerification,
      verificationToken: this.options.requireEmailVerification ? verificationToken : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserDocument);

    return { user, verificationToken };
  }

  async login(input: z.infer<typeof loginSchema>) {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    if (this.options.requireEmailVerification && !user.emailVerified) {
      throw new Error("Email not verified");
    }

    const token = signToken(
      { userId: String(user._id), email: user.email, role: user.role },
      this.options.jwtSecret,
      this.options.jwtExpiresIn,
    );

    return { user, token };
  }

  async verifyEmail(token: string) {
    const user = await this.users.findOne({ verificationToken: token } as Partial<UserDocument>);
    if (!user) {
      throw new Error("Invalid verification token");
    }

    const updated = await this.users.update(String(user._id), {
      emailVerified: true,
      verificationToken: undefined,
      updatedAt: new Date(),
    } as Partial<UserDocument>);

    if (!updated) {
      throw new Error("Failed to verify email");
    }

    return user;
  }

  async requestPasswordReset(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;

    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await this.users.update(String(user._id), {
      resetToken,
      resetTokenExpiry,
      updatedAt: new Date(),
    } as Partial<UserDocument>);

    return { user, resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.users.findOne({ resetToken: token } as Partial<UserDocument>);
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new Error("Invalid or expired reset token");
    }

    const passwordHash = await hashPassword(newPassword);
    await this.users.update(String(user._id), {
      passwordHash,
      resetToken: undefined,
      resetTokenExpiry: undefined,
      updatedAt: new Date(),
    } as Partial<UserDocument>);

    return user;
  }

  async getUserFromToken(token: string) {
    const payload = verifyToken(token, this.options.jwtSecret);
    if (!payload) return null;

    return this.users.findById(payload.userId);
  }
}

export * from "./config.js";
export * from "./verification-email.js";
