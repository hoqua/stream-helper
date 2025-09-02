import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { envWeb } from '@durablr/shared-utils-schemas';
import * as schema from './schema';

const sql = neon(envWeb.DATABASE_URL);

export const db = drizzle(sql, { schema });
