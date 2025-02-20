import { config } from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Load env variables
config({ path: join(__dirname, '.env') });

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL', 
  'NEWS_API_KEY',
  'CLERK_SECRET_KEY'
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ ${envVar} is not set in .env file!`);
  }
}

export const CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEWS_API_KEY: process.env.NEWS_API_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  PORT: process.env.PORT || 3000
} as const; 