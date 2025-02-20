"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserPreferences = createUserPreferences;
const drizzle_orm_1 = require("drizzle-orm");
async function createUserPreferences(db) {
    await db.execute((0, drizzle_orm_1.sql) `
    CREATE TABLE IF NOT EXISTS user_preferences (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      categories JSONB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}
