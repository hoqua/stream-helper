import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import sensiblePlugin from './app/plugins/sensible';
import { registerStreamHelperRoute, streamService } from '@durablr/feature-stream-helper';
import { env } from './env';

const host = env.HOST;
const port = env.PORT;

// Instantiate Fastify with some config
const server = Fastify({
  logger: {
    level: env.LOG_LEVEL,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        parameters: req.params,
        headers: req.headers,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  },

  bodyLimit: 10485760, // Request body size limit: 10MB
  requestTimeout: 30000,
});

// Register security plugins
server.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
server.register(cors, {
  origin: env.NODE_ENV === 'production' 
    ? ['https://durablr.com']
    : true,
  credentials: true,
});

// Rate limiting: 100 requests per minute per IP
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  allowList: [], // IPs to exclude from rate limiting
  redis: undefined, // Can add Redis for distributed rate limiting
  skipOnError: true, // Don't apply rate limiting if error occurs
  addHeadersOnExceeding: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true,
  },
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true,
    'retry-after': true,
  },
});

// Register error handling plugin
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
      // Clean up active streams on shutdown
      await streamService.destroy();
      
      await server.close();
      process.exit(0);
    } catch (error) {
      server.log.error(`Error during shutdown: ${error}`);
      process.exit(1);
    }
  });
}

// Global error handler
server.setErrorHandler((error, request, reply) => {
  // Log error with context
  server.log.error({
    err: error,
    request: {
      method: request.method,
      url: request.url,
      id: request.id,
    },
  }, 'Request failed');

  // Don't expose internal errors in production
  if (env.NODE_ENV === 'production') {
    if (error.statusCode === 429) {
      reply.status(429).send({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded, please try again later',
      });
    } else if (error.statusCode && error.statusCode < 500) {
      reply.status(error.statusCode).send({
        error: error.message,
      });
    } else {
      reply.status(500).send({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      });
    }
  } else {
    // In development, return full error details
    reply.status(error.statusCode || 500).send(error);
  }
});

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
