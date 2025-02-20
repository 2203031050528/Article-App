"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const dotenv_1 = __importDefault(require("dotenv"));
const _0000_create_tables_1 = require("./migrations/0000_create_tables");
dotenv_1.default.config();
async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set");
    }
    const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
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
