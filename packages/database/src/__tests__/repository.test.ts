import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ObjectId, type Document } from "mongodb";
import {
  BaseRepository,
  connectDatabase,
  disconnectDatabase,
  getDb,
  parseDocumentId,
} from "../index.js";

interface TestDocument extends Document {
  _id?: ObjectId;
  email: string;
  emailVerified: boolean;
  verificationToken?: string;
}

class TestUserRepository extends BaseRepository<TestDocument> {
  constructor() {
    super("test_users");
  }
}

const testDb = `genesis_repo_test_${Date.now()}`;

describe("BaseRepository", () => {
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

  it("updates documents by ObjectId string id", async () => {
    const repo = new TestUserRepository();
    const user = await repo.create({
      email: "user@example.com",
      emailVerified: false,
      verificationToken: "abc123",
    });

    const updated = await repo.update(String(user._id), {
      emailVerified: true,
      verificationToken: undefined,
    });

    expect(updated).toBe(true);

    const reloaded = await repo.findById(String(user._id));
    expect(reloaded?.emailVerified).toBe(true);
    expect(reloaded?.verificationToken).toBeUndefined();
  });

  it("parses valid ObjectId strings", () => {
    const id = new ObjectId();
    expect(parseDocumentId(String(id)).equals(id)).toBe(true);
  });
});
