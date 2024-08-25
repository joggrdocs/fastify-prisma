import type { FastifyPluginCallback } from 'fastify';

export const routes: FastifyPluginCallback = (server, options, done) => {
  server.get('/rubber-duckies', async (request, reply) => {
    const ducks = await server.prisma.rubberDucky.findMany();

    if (!ducks || ducks.length === 0) {
      reply.status(404);
      return { message: '🦆 No rubber duckies found, just this real duck.' };
    } else {
      return { ducks, message: '🐥 Quack! We found our Rubber Duckies!' };
    }
  });

  done();
};

export default routes;
