import { FastifyInstance } from 'fastify';
import { getAllUsers } from '@durablr/shared-data-access-db';

export default async function rootRoute(fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return getAllUsers();
  });
}
