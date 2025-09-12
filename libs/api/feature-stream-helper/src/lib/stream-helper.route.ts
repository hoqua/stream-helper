import { FastifyInstance } from 'fastify';
import { streamService, StreamConfig } from './stream-helper.service';
import { StreamSubscribeRequestSchema, StreamIdParamSchema } from '@durablr/shared-utils-schemas';
import { validateAccessToken } from './auth.utils';
import { getStreamLogs } from '@durablr/shared-data-access-db';

export function registerStreamHelperRoute(fastify: FastifyInstance) {
  // Pass Fastify logger to stream service
  streamService.setLogger(fastify.log);

  // Generic stream subscription - works with any SSE endpoint
  fastify.post('/stream/subscribe', async (request, reply) => {
    const accessToken = request.headers.authorization;

    if (!accessToken) {
      reply.code(401);
      return { error: 'Authorization failed' };
    }

    const valid = validateAccessToken(accessToken);

    if (!valid) {
      reply.code(401);
      return { error: 'Invalid Token' };
    }

    // Validate request body using Zod
    const validatedBody = StreamSubscribeRequestSchema.parse(request.body);

    const streamConfig: StreamConfig = {
      streamUrl: validatedBody.streamUrl,
      projectId: validatedBody.projectId,
      webhookUrl: validatedBody.webhookUrl,
      headers: validatedBody.headers,
      body: validatedBody.body,
      method: validatedBody.method,
      saveStreamData: validatedBody.saveStreamData,
    };

    const streamId = await streamService.subscribeToStream(streamConfig);
    return { streamId };
  });

  // Stop stream subscription
  fastify.delete('/stream/subscribe/:streamId', async (request, reply) => {
    const accessToken = request.headers.authorization;

    if (!accessToken) {
      reply.code(401);
      return { error: 'Authorization failed' };
    }

    const valid = validateAccessToken(accessToken);

    if (!valid) {
      reply.code(401);
      return { error: 'Invalid Token' };
    }
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
  fastify.get('/stream/active', async (request, reply) => {
    const accessToken = request.headers.authorization;

    if (!accessToken) {
      reply.code(401);
      return { error: 'Authorization failed' };
    }

    const valid = validateAccessToken(accessToken);

    if (!valid) {
      reply.code(401);
      return { error: 'Invalid Token' };
    }

    const activeStreams = streamService.getActiveStreams();
    return { activeStreams, count: activeStreams.length };
  });

  // Get stream logs for a specific stream
  fastify.get('/stream/:streamId/logs', async (request, reply) => {
    // Validate streamId parameter using Zod
    const validatedParams = StreamIdParamSchema.parse(request.params);

    try {
      const logs = await getStreamLogs(validatedParams.streamId);
      return { streamId: validatedParams.streamId, logs, count: logs.length };
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to retrieve stream logs' };
    }
  });
}
