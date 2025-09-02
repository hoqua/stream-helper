import { z } from 'zod';

// HTTP Methods validation
export const HttpMethodSchema = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).default('GET');

// Headers validation - ensures headers are key-value string pairs
export const HeadersSchema = z.record(z.string(), z.string()).optional();

// Request body validation - allows any JSON-serializable value
export const RequestBodySchema = z.unknown().optional();

// Stream subscription request validation
export const StreamSubscribeRequestSchema = z.object({
  streamUrl: z.url('streamUrl must be a valid URL'),
  webhookUrl: z.url('webhookUrl must be a valid URL'),
  method: HttpMethodSchema,
  headers: HeadersSchema,
  body: RequestBodySchema,
  projectId: z.string().min(1, 'projectId is required')
});

// Stream subscription response validation
export const StreamSubscribeResponseSchema = z.object({
  streamId: z.uuid('streamId must be a valid UUID'),
});

// Active streams response validation
export const ActiveStreamsResponseSchema = z.object({
  activeStreams: z.array(z.uuid()),
  count: z.number().int().min(0),
});

// Stream stop response validation
export const StreamStopResponseSchema = z.object({
  message: z.string(),
  streamId: z.uuid(),
});

// Stream ID parameter validation
export const StreamIdParamSchema = z.object({
  streamId: z.uuid('streamId must be a valid UUID'),
});

// Error response validation
export const ErrorResponseSchema = z.object({
  error: z.string().min(1, 'Error message cannot be empty'),
  details: z.unknown().optional(),
  code: z.string().optional(),
});

// Type exports
export type StreamSubscribeRequest = z.infer<typeof StreamSubscribeRequestSchema>;
export type StreamSubscribeResponse = z.infer<typeof StreamSubscribeResponseSchema>;
export type ActiveStreamsResponse = z.infer<typeof ActiveStreamsResponseSchema>;
export type StreamStopResponse = z.infer<typeof StreamStopResponseSchema>;
export type StreamIdParam = z.infer<typeof StreamIdParamSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type HttpMethod = z.infer<typeof HttpMethodSchema>;
