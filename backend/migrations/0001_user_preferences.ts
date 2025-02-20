import { sql } from "drizzle-orm";

export async function createUserPreferences(db: any) {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      categories JSONB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
} 