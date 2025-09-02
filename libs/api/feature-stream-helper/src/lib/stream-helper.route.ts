import { FastifyInstance } from 'fastify';
import { streamService, StreamConfig } from './stream-helper.service';

export async function registerStreamHelperRoute(fastify: FastifyInstance) {
  // Generic stream subscription - works with any SSE endpoint
  fastify.post('/stream/subscribe', async (request, reply) => {
    try {
      const { streamUrl, projectId, webhookUrl, headers, body, method } = request.body as {
        streamUrl: string;
        projectId: string;
        webhookUrl: string;
        headers?: Record<string, string>;
        body?: unknown;
        method?: string;
      };

      if (!streamUrl || !webhookUrl) {
        reply.code(400);
        return { error: 'streamUrl and webhookUrl are required' };
      }

      const streamConfig: StreamConfig = {
        streamUrl,
        projectId,
        webhookUrl,
        headers,
        body,
        method,
      };

      const streamId = await streamService.subscribeToStream(streamConfig);

      return { streamId };
    } catch (error) {
      reply.code(500);
      return { error: (error as Error).message };
    }
  });

  // Stop stream subscription
  fastify.delete('/stream/subscribe/:streamId', async (request, reply) => {
    try {
      const { streamId } = request.params as { streamId: string };

      const success = await streamService.stopStream(streamId);

      if (!success) {
        reply.code(404);
        return { error: 'Stream not found' };
      }

      return { message: 'Stream stopped', streamId };
    } catch (error) {
      reply.code(500);
      return { error: (error as Error).message };
    }
  });

  // Get active streams
  fastify.get('/stream/active', async () => {
    const activeStreams = streamService.getActiveStreams();
    return { activeStreams, count: activeStreams.length };
  });
}
