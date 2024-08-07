import { PrismaClient } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
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

type PrismaClientConfig = Omit<
  ConstructorParameters<typeof PrismaClient>[0],
  '__internal'
>;

interface PrismaPluginOptionsWithClient {
  /**
   * Allow overriding the prisma client instance, with a custom one.
   */
  client: PrismaClient;
}

interface PrismaPluginOptionsWithoutClient {
  /**
   * Allow passing the prisma client configuration, to create a new instance.
   */
  clientConfig?: PrismaClientConfig;
}

export type PrismaPluginOptions =
  | PrismaPluginOptionsWithClient
  | PrismaPluginOptionsWithoutClient;

const createClient = async (
  pluginOptions: PrismaPluginOptions
): Promise<PrismaClient> => {
  if ('client' in pluginOptions) {
    return pluginOptions.client;
  } else {
    return new PrismaClient(pluginOptions.clientConfig);
  }
};

const prismaPlugin: FastifyPluginAsync<PrismaPluginOptions> = async (
  fastify,
  opts
) => {
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
 * Fastify Prisma plugin connection to share the same connection across your entire server
 */
export default fp<PrismaPluginOptions>(prismaPlugin, {
  name: '@joggr/fastify-prisma',
  fastify: '4.x',
});
