import type { ObjectId } from "mongodb";

export interface UserDocument {
  _id?: ObjectId | string;
  email: string;
  passwordHash: string;
  name?: string;
  role: "user" | "admin";
  emailVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionDocument {
  _id?: ObjectId | string;
  userId: string;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  provider: "paystack";
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDocument {
  _id?: ObjectId | string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  channel: "in-app" | "email" | "sms";
  createdAt: Date;
}

export interface SessionDocument {
  _id?: ObjectId | string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
