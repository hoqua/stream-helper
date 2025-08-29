import z from 'zod';

export const ModeEnum = z.enum(['realtime', 'batch', 'daily']);

export const ConfigurationSchema = z.object({
  webhookUrl: z.string().optional(),
  processingMode: z.enum(['realtime', 'batch', 'daily']),
  automaticProcessing: z.boolean(),
});

export type ConfigurationType = z.infer<typeof ConfigurationSchema>;
export type ModeType = z.infer<typeof ModeEnum>;
