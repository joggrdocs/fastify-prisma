import type { FastifyPluginCallback } from 'fastify';

export const routes: FastifyPluginCallback = (server, options, done) => {
  server.get('/rubber-duckies', async (request, reply) => {
    const ducks = await server.prisma.rubberDucky.findMany();

    if (!ducks || ducks.length === 0) {
      reply.status(404).send({ message: '🐥 Quackerz!' });
    } else {
      reply.send({ ducks, message: '🐥 Quack!' });
    }
  });

  done();
};

export default routes;
