import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

import prismaPlugin from '../src/index';

describe('plugin', () => {
  let fastify;

  beforeEach(() => {
    fastify = Fastify();
    fastify.register(prismaPlugin);
    return fastify.ready();
  });

  afterEach(() => fastify.close());

  it('should register `fastify.prisma`', async () => {
    expect(fastify.prisma).toBeDefined();
  });

  it('should decorate `fastify.prisma` with valid prisma object', async () => {
    expect(await fastify.prisma.rubberDucky.count()).toBe(2);
  });

  it('should fail if registering plugin more than once', async () => {
    const fastifyWithErrors = Fastify();
    await fastifyWithErrors.register(prismaPlugin);
    await expect(fastifyWithErrors.register(prismaPlugin)).rejects.toThrow(
      'A `prisma` decorator has already been registered, please ensure you are not registering multiple instances of this plugin'
    );
  });

  it('should accept `PrismaClientOptions`', async () => {
    const quacks: string[] = [];

    const fastifyWithLogs = Fastify();
    await fastifyWithLogs.register(prismaPlugin, {
      clientConfig: {
        // Testing via emitting events
        // @link https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging#the-log-option
        log: [{ emit: 'event', level: 'query' }]
      }
    });
    await fastifyWithLogs.ready();

    // @todo Assess how to fix this or provide documentation (or both)
    fastifyWithLogs.prisma.$on('query', () => {
      quacks.push('quack');
    });

    const ducks = await fastifyWithLogs.prisma.rubberDucky.findMany({
      where: {
        name: 'Bob'
      }
    });

    expect(ducks.length).toBe(1);
    expect(quacks.length).toBe(1);
  });

  it('should accept a already instantiated `PrismaClient`', async () => {
    const fastifyWithClient = Fastify();
    const myClient = new PrismaClient();
    await fastifyWithClient.register(prismaPlugin, {
      client: myClient
    });
    await fastifyWithClient.ready();

    const ducks = await fastifyWithClient.prisma.rubberDucky.findMany({
      where: {
        name: 'Bob'
      }
    });

    expect(fastifyWithClient.prisma).toBe(myClient);
    expect(ducks.length).toBe(1);
  });
});
