import Fastify from 'fastify';
import sensiblePlugin from './app/plugins/sensible';
import rootRoute from './app/routes/root';
import { registerStreamHelperRoute } from '@durablr/feature-stream-helper';

const host = '0.0.0.0'
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register plugins
server.register(sensiblePlugin);

// Register routes
server.register(rootRoute);
server.register((fastify) => {
  registerStreamHelperRoute(fastify);
});

// Health check route
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start listening.
server.listen({ port, host }, (error) => {
  if (error) {
    server.log.error(error);
    throw error;
  } else {
    console.log(`[ ready ] http://${host}:${port}`);
  }
});
