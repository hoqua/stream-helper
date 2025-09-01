import z from 'zod';

export const Status = z.enum(['success', 'error', 'warning', 'processing']);

export const OverviewMetricsSchema = z.object({
  totalEvents: z.number().min(0),
  successRate: z.number().min(0).max(100),
  avgLatency: z.number().min(0),
  activeStreams: z.number().min(0),
  errorRate: z.number().min(0).max(100),
  throughput: z.number().min(0),
});

export const MetricSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  projectId: z.string(),
  eventType: z.string(),
  status: Status,
  duration: z.number(),
  source: z.string(),
  destination: z.string(),
  dataSize: z.string(),
});

export type Metric = z.infer<typeof MetricSchema>;
export type Status = z.infer<typeof Status>;
export type OverviewMetrics = z.infer<typeof OverviewMetricsSchema>;
