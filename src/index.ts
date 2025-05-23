import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

/*
|==========================================================================
| Fastify Prisma Plugin
|==========================================================================
|
| Fastify Prisma plugin connection to share the same connection across your entire server
|
*/

declare namespace fastifyPrisma {
  export type FastifyPrismaOptions = {
    /**
     * The Prisma client instance to use, this is generated by Prisma.
     * @example
     * ```ts
     * import { PrismaClient } from '../my-prisma-client';
     *
     * const client = new PrismaClient();
     * await fastify.register(fastifyPrisma, { client });
     * ```
     */
    client: BasePrismaClient;
  };

  export const fastifyPrisma: FastifyPrisma;
  export { fastifyPrisma as default };
}

/**
 * Fastify plugin that allows you to share the same `prisma` connection across your entire fastify app.
 *
 * @example
 *  ```typescript
 * await fastify.register(fastifyPrisma);
 *
 * fastify.get('/users', async (request, reply) => {
 *   const users = await fastify.prisma.user.findMany();
 *   return users;
 * });
 * ```
 */
export default fp(
  async (
    fastify: FastifyInstance,
    opts: fastifyPrisma.FastifyPrismaOptions
  ): Promise<void> => {
    if (!opts.client) {
      throw new Error('`client` is required');
    }

    if (!fastify.hasDecorator('prisma')) {
      const { client } = opts;
      await client.$connect();

      // Decorate the fastify instance with the Prisma client
      fastify.decorate('prisma', client);

      // Safely disconnect the Prisma client when the server shuts down
      fastify.addHook('onClose', async (server) => {
        // @ts-expect-error - We need to allow any here, as the Prisma client is generated by Prisma
        await server.prisma.$disconnect();
      });
    } else {
      throw new Error(
        'A `prisma` decorator has already been registered, please ensure you are not registering multiple instances of this plugin'
      );
    }
  },
  {
    name: '@joggr/fastify-prisma',
    fastify: '5.x',
  }
);

type FastifyPrisma = FastifyPluginAsync<fastifyPrisma.FastifyPrismaOptions>;

/**
 * A base type for the Prisma client generated by Prisma just for light-weight type-safety
 */
type BasePrismaClient = {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  [key: string]: AllowedAny;
};

// biome-ignore lint/suspicious/noExplicitAny: We need to allow any here, as the Prisma client is generated by Prisma
type AllowedAny = any;
