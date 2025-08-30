import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');

config({ path: envPath });

export default defineConfig({
  out: './libs/shared/data-access-db/src/lib/drizzle/',
  schema: './libs/shared/data-access-db/src/lib/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
