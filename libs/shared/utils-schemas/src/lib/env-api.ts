import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const envApi = createEnv({
  server: {
    PORT: z.coerce.number().default(3001),
    HOST: z.string().default('0.0.0.0'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  },

  runtimeEnv: process.env,
});
