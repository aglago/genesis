import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { connectDatabase, disconnectDatabase, getDb } from "@genesis/database";
import { AuthService } from "../index.js";

const testDb = `genesis_auth_test_${Date.now()}`;

describe("AuthService email verification", () => {
  beforeAll(async () => {
    await disconnectDatabase();
    await connectDatabase({
      MONGODB_URI: process.env.MONGODB_URI ?? "mongodb://localhost:27017",
      MONGODB_DB_NAME: testDb,
    });
  });

  afterAll(async () => {
    await getDb().dropDatabase();
    await disconnectDatabase();
  });

  it("allows login after verifyEmail", async () => {
    const auth = new AuthService({
      jwtSecret: "test-secret-key-minimum-32-chars!!",
      jwtExpiresIn: "1h",
      requireEmailVerification: true,
    });

    const email = `verified-${Date.now()}@example.com`;
    const { verificationToken } = await auth.register({
      email,
      password: "password123",
      name: "Test",
    });

    await expect(auth.login({ email, password: "password123" })).rejects.toThrow("Email not verified");

    await auth.verifyEmail(verificationToken!);

    const session = await auth.login({ email, password: "password123" });
    expect(session.token).toBeTruthy();
    expect(session.user.emailVerified).toBe(true);
  });
});
