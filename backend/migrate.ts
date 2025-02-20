import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { CONFIG } from "./config";
import { createTables } from "./migrations/0000_create_tables";

async function main() {
  const sql = neon(CONFIG.DATABASE_URL);
  const db = drizzle(sql as any);

  console.log("Running migrations...");
  
  try {
    await createTables(db);
    console.log("✅ Tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    process.exit(1);
  }
}

main(); 