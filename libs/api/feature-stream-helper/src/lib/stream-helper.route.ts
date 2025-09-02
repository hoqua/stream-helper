import { FastifyInstance } from 'fastify';
import { streamService, StreamConfig } from './stream-helper.service';
import { StreamSubscribeRequestSchema, StreamIdParamSchema } from '@durablr/shared-utils-schemas';

export function registerStreamHelperRoute(fastify: FastifyInstance) {
  // Generic stream subscription - works with any SSE endpoint
  fastify.post('/stream/subscribe', async (request, reply) => {
    // Validate request body using Zod
    const validatedBody = StreamSubscribeRequestSchema.parse(request.body);

    const streamConfig: StreamConfig = {
      streamUrl: validatedBody.streamUrl,
      projectId: validatedBody.projectId,
      webhookUrl: validatedBody.webhookUrl,
      headers: validatedBody.headers,
      body: validatedBody.body,
      method: validatedBody.method,
    };

    const streamId = await streamService.subscribeToStream(streamConfig);
    return { streamId };
  });

  // Stop stream subscription
  fastify.delete('/stream/subscribe/:streamId', async (request, reply) => {
    // Validate streamId parameter using Zod
    const validatedParams = StreamIdParamSchema.parse(request.params);

    const success = await streamService.stopStream(validatedParams.streamId);

    if (!success) {
      reply.code(404);
      return { error: 'Stream not found' };
    }

    return { message: 'Stream stopped', streamId: validatedParams.streamId };
  });

  // Get active streams
  fastify.get('/stream/active', async () => {
    const activeStreams = streamService.getActiveStreams();
    return { activeStreams, count: activeStreams.length };
  });
}
