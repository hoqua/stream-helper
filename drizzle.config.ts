import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import path from 'path';

// Load env for drizzle-kit CLI tool
const envPath = path.resolve(process.cwd(), '.env.local');
config({ path: envPath });

// Note: drizzle-kit runs outside of Next.js/app context, so we need to use process.env directly
export default defineConfig({
  out: './libs/shared/data-access-db/src/lib/drizzle/',
  schema: './libs/shared/data-access-db/src/lib/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
