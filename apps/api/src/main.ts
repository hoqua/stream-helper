import Fastify from 'fastify';
import sensiblePlugin from './app/plugins/sensible';
import { registerStreamHelperRoute } from '@durablr/feature-stream-helper';
import { env } from './env';

const host = env.HOST;
const port = env.PORT;

// Instantiate Fastify with some config
const server = Fastify({
  logger: {
    level: env.LOG_LEVEL,
  },
});

// Register plugins
server.register(sensiblePlugin);

// Register routes
server.register((fastify) => {
  registerStreamHelperRoute(fastify);
});

// Health check route
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
for (const signal of signals) {
  process.on(signal, async () => {
    server.log.info(`Received ${signal}, shutting down gracefully...`);
    try {
      await server.close();
      process.exit(0);
    } catch (error) {
      server.log.error(`Error during shutdown: ${error}`);
      process.exit(1);
    }
  });
}

// Start listening.
server.listen({ port, host }, (error) => {
  if (error) {
    server.log.error(error);
    throw error;
  } else {
    server.log.info(`Server running in ${env.NODE_ENV} mode`);
    server.log.info(`[ ready ] http://${host}:${port}`);
  }
});
