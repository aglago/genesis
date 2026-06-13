import { z } from "zod";
import { MongoClient, Db, Collection, Document, Filter, OptionalUnlessRequiredId } from "mongodb";

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

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectDatabase() first.");
  }
  return db;
}

export abstract class BaseRepository<T extends Document> {
  protected collection: Collection<T>;

  constructor(collectionName: string) {
    this.collection = getDb().collection<T>(collectionName);
  }

  async findById(id: string): Promise<T | null> {
    return this.collection.findOne({ _id: id } as Filter<T>) as Promise<T | null>;
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
    const result = await this.collection.updateOne({ _id: id } as Filter<T>, { $set: data });
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id } as Filter<T>);
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
