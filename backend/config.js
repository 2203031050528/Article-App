"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const url_1 = require("url");
const __dirname = (0, url_1.fileURLToPath)(new URL('.', import.meta.url));
// Load env variables
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, '.env') });
// Validate required environment variables
const requiredEnvVars = [
    'DATABASE_URL',
    'NEWS_API_KEY',
    'CLERK_SECRET_KEY'
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`❌ ${envVar} is not set in .env file!`);
    }
}
exports.CONFIG = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    PORT: process.env.PORT || 3000
};
