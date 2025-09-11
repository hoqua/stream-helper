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
    CLERK_SECRET_KEY: z.string().min(2),
  },

  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(2),
    NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: z.string().min(2),
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string().min(2),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(2),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(2),
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    VERCEL_CLIENT_ID: process.env.VERCEL_CLIENT_ID,
    VERCEL_CLIENT_SECRET: process.env.VERCEL_CLIENT_SECRET,
    SECRET_JWT_KEY: process.env.SECRET_JWT_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL || '/dashboard',
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL || '/dashboard',
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    // 1. For production, always use the explicitly defined API_URL.
    // 2. For Vercel preview deployments, build the Railway preview URL.
    // Known issue: VERCEL_GIT_PULL_REQUEST_ID does not increment if a PR is
    // re-created on the same branch. In such cases, Railway will increment
    // the PR number, leading to a mismatched URL.
    API_URL:
      process.env.API_URL ||
      `https://durablr-api-stream-helper-${process.env.VERCEL_GIT_PULL_REQUEST_ID!}.up.railway.app`,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

// Print expected API URL during Vercel builds
if (process.env.VERCEL && process.env.VERCEL_GIT_PULL_REQUEST_ID) {
  const expectedApiUrl = `https://durablr-api-stream-helper-${process.env.VERCEL_GIT_PULL_REQUEST_ID}.up.railway.app`;
  console.log(`EXPECT API TO BE ON: ${expectedApiUrl}`);
}
