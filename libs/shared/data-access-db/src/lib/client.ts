import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Only initialize database if DATABASE_URL is present (skip during build)
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export const db = sql ? drizzle(sql, { schema }) : null as any;
