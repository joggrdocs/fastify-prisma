import fastifyPrisma from '@joggr/fastify-prisma';
import Fastify from 'fastify';

import rubberDuckies from './routes/rubber-duckies';

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    // Register the Prisma plugin
    await fastify.register(fastifyPrisma);

    // Register the routes
    fastify.register(rubberDuckies);

    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
