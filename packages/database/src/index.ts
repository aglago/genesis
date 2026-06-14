import { z } from "zod";
import {
  MongoClient,
  Db,
  Collection,
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from "mongodb";

export const databaseEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().default("genesis"),
});

export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDatabase(env: Partial<DatabaseEnv> = process.env as DatabaseEnv): Promise<Db> {
  const config = databaseEnvSchema.parse(env);

  if (db) return db;

  client = new MongoClient(config.MONGODB_URI);
  await client.connect();
  db = client.db(config.MONGODB_DB_NAME);

  return db;
}

export async function disconnectDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

export function parseDocumentId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid document id: ${id}`);
  }
  return new ObjectId(id);
}

function buildUpdateQuery<T extends Document>(data: Partial<T>): UpdateFilter<T> {
  const $set: Record<string, unknown> = {};
  const $unset: Record<string, ""> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      $unset[key] = "";
    } else {
      $set[key] = value;
    }
  }

  const update: UpdateFilter<T> = {};
  if (Object.keys($set).length > 0) {
    update.$set = $set as Partial<T>;
  }
  if (Object.keys($unset).length > 0) {
    update.$unset = $unset as UpdateFilter<T>["$unset"];
  }

  return update;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectDatabase() first.");
  }
  return db;
}

export abstract class BaseRepository<T extends Document> {
  constructor(private collectionName: string) {}

  protected get collection(): Collection<T> {
    return getDb().collection<T>(this.collectionName);
  }

  async findById(id: string): Promise<T | null> {
    return this.collection.findOne({ _id: parseDocumentId(id) } as Filter<T>) as Promise<T | null>;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return this.collection.findOne(filter as Filter<T>) as Promise<T | null>;
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    return this.collection.find(filter as Filter<T>).toArray() as Promise<T[]>;
  }

  async create(data: OptionalUnlessRequiredId<T>): Promise<T> {
    const result = await this.collection.insertOne(data);
    return { ...data, _id: result.insertedId } as T;
  }

  async update(id: string, data: Partial<T>): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: parseDocumentId(id) } as Filter<T>,
      buildUpdateQuery(data),
    );
    return result.matchedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: parseDocumentId(id) } as Filter<T>);
    return result.deletedCount > 0;
  }

  async count(filter: Partial<T> = {}): Promise<number> {
    return this.collection.countDocuments(filter as Filter<T>);
  }
}

export interface Migration {
  name: string;
  up: (db: Db) => Promise<void>;
  down: (db: Db) => Promise<void>;
}

export async function runMigrations(migrations: Migration[]): Promise<void> {
  const database = getDb();
  const migrationsCollection = database.collection("migrations");

  for (const migration of migrations) {
    const existing = await migrationsCollection.findOne({ name: migration.name });
    if (!existing) {
      await migration.up(database);
      await migrationsCollection.insertOne({ name: migration.name, appliedAt: new Date() });
    }
  }
}

export interface PostgresAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
}

export class PostgresAdapterStub implements PostgresAdapter {
  async connect(): Promise<void> {
    throw new Error("PostgreSQL support is not yet implemented.");
  }

  async disconnect(): Promise<void> {
    throw new Error("PostgreSQL support is not yet implemented.");
  }

  async query<T>(_sql: string, _params?: unknown[]): Promise<T[]> {
    throw new Error("PostgreSQL support is not yet implemented.");
  }
}

export * from "./schemas.js";
