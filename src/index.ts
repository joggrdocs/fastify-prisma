import { type Prisma, PrismaClient } from '@prisma/client';
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

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

type FastifyPrisma = FastifyPluginAsync<fastifyPrisma.FastifyPrismaOptions>;

declare namespace fastifyPrisma {
  // @ts-expect-error - Ignore this error, as we are re-exporting the Prisma types that are peer dependencies
  type PrismaClientConfig = Prisma.PrismaClientOptions;

  interface FastifyPrismaOptionsWithClient {
    /**
     * Allow overriding the prisma client instance, with a custom one.
     */
    client: PrismaClient;
  }

  interface FastifyPrismaOptionsWithoutClient {
    /**
     * Allow passing the prisma client configuration, to create a new instance.
     */
    clientConfig?: PrismaClientConfig;
  }

  export type FastifyPrismaOptions =
    | FastifyPrismaOptionsWithClient
    | FastifyPrismaOptionsWithoutClient;

  export const fastifyPrisma: FastifyPrisma;
  export { fastifyPrisma as default };
}

/**
 * We define our own plugin function so TypeScript can infer the types correctly & use the `export =` syntax (see below)
 *
 * @see https://github.com/fastify/fastify-plugin?tab=readme-ov-file#known-issue-typescript-contextual-inference
 * @see https://github.com/fastify/fastify/issues/2403
 * @see https://github.com/fastify/fastify-sensible/blob/master/types/index.d.ts
 */
const plugin = async (
  fastify: FastifyInstance,
  opts: fastifyPrisma.FastifyPrismaOptions
): Promise<void> => {
  if (!fastify.hasDecorator('prisma')) {
    const client = await createClient(opts);
    await client.$connect();
    fastify.decorate('prisma', client);
    fastify.addHook('onClose', async (server) => {
      await server.prisma.$disconnect();
    });
  } else {
    throw new Error(
      'A `prisma` decorator has already been registered, please ensure you are not registering multiple instances of this plugin'
    );
  }
};

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
export default fp(plugin, {
  name: '@joggr/fastify-prisma',
  fastify: '5.x',
});

/*
|------------------
| Utils
|------------------
*/

/**
 * Create a PrismaClient instance based on the plugin options.
 *
 * @param pluginOptions A PrismaPluginOptions object
 * @returns A PrismaClient instance
 */
const createClient = async (
  pluginOptions: fastifyPrisma.FastifyPrismaOptions
): Promise<PrismaClient> => {
  if ('client' in pluginOptions) {
    return pluginOptions.client;
  } else {
    return new PrismaClient(pluginOptions.clientConfig);
  }
};
