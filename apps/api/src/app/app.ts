import path from 'node:path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, options: AppOptions) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...options },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...options },
  });
}
