import { z } from 'zod';

export const ApiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
});

export const ApiKeyFromSchema = z.object({
  name: z.string(),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;
export type ApiKeyForm = z.infer<typeof ApiKeyFromSchema>;
