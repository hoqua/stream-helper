import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// NOTE: env-web and env-api are intentionally NOT used here. Used for all apps and validation not possible
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
