import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export async function createTables(db: any) {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
} 