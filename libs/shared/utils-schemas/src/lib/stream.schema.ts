import z from 'zod';

export const Status = z.enum(['active', 'completed', 'error', 'stopped']);

export const OverviewMetricsSchema = z.object({
  totalEvents: z.number(),
  successRate: z.number(),
  activeStreams: z.number(),
  errorRate: z.number(),
});

export const StreamSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  streamUrl: z.string(),
  webhookUrl: z.string(),
  status: Status,
  createdAt: z.date(),
  updatedAt: z.date(),
  errorMessage: z.string().nullable(),
});

export type Stream = z.infer<typeof StreamSchema>;
export type Status = z.infer<typeof Status>;
export type OverviewMetrics = z.infer<typeof OverviewMetricsSchema>;
