import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const envWeb = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    VERCEL_CLIENT_ID: z.string().min(1),
    VERCEL_CLIENT_SECRET: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },

  client: {
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    VERCEL_CLIENT_ID: process.env.VERCEL_CLIENT_ID || process.env.CLIENT_ID,
    VERCEL_CLIENT_SECRET: process.env.VERCEL_CLIENT_SECRET || process.env.CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION
});
