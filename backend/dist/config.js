"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
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
    PORT: Number(process.env.PORT) || 3000
};
