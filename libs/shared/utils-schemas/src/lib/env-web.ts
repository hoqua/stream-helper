import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const envWeb = createEnv({
  server: {
    DATABASE_URL: z.url(),
    VERCEL_CLIENT_ID: z.string().min(2),
    VERCEL_CLIENT_SECRET: z.string().min(2),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    SECRET_JWT_KEY: z.string().min(2),
    API_URL: z.url(),
  },

  client: {
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    VERCEL_CLIENT_ID: process.env.VERCEL_CLIENT_ID,
    VERCEL_CLIENT_SECRET: process.env.VERCEL_CLIENT_SECRET,
    SECRET_JWT_KEY: process.env.SECRET_JWT_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    // API URL priority:
    // 1. Use explicit API_URL if set (production/manual override)
    // 2. Fallback: Auto-generate Railway preview URL for Vercel previews
    // 
    // KNOWN ISSUE: VERCEL_GIT_PULL_REQUEST_ID doesn't exist as a Vercel system variable
    // This will result in "undefined" in the URL. Use GitHub Action to set API_URL instead.
    API_URL: process.env.API_URL || 
      `https://durablr-api-stream-helper-${process.env.VERCEL_GIT_PULL_REQUEST_ID || 'undefined'}.up.railway.app`,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
