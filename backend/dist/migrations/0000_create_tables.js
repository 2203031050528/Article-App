"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articles = void 0;
exports.createTables = createTables;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.articles = (0, pg_core_1.pgTable)("articles", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    url: (0, pg_core_1.text)("url").notNull(),
    category: (0, pg_core_1.text)("category").notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull().defaultNow(),
});
async function createTables(db) {
    await db.execute((0, drizzle_orm_1.sql) `
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}
