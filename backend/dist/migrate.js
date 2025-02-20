"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const config_1 = require("./config");
const _0000_create_tables_1 = require("./migrations/0000_create_tables");
async function main() {
    const sql = (0, serverless_1.neon)(config_1.CONFIG.DATABASE_URL);
    const db = (0, neon_http_1.drizzle)(sql);
    console.log("Running migrations...");
    try {
        await (0, _0000_create_tables_1.createTables)(db);
        console.log("✅ Tables created successfully!");
    }
    catch (error) {
        console.error("❌ Error creating tables:", error);
        process.exit(1);
    }
}
main();
