import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { CONFIG } from "./config";

const sql = neon(CONFIG.DATABASE_URL);
export const db = drizzle(sql as any, { schema });

// Verify connection
async function verifyConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

verifyConnection();
