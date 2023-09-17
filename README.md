# fastify-prisma

![CI](https://github.com/joggrdocs/fastify-prisma/workflows/CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/%40joggr/fastify-prisma)](https://www.npmjs.com/package/@joggr/fastify-prisma)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/standard/semistandard)

Fastify Prisma plugin to share the same `PrismaClient` across your entire server.

## Getting Started

Before using this plugin you will need to have [`prisma`](https://www.prisma.io/docs/getting-started) set up. Once you are all set with `prisma` install the package and register the plugin on your server.

### Install the package

**npm**

```shell
$ npm i fastify-prisma
```

**yarn**

```shell
$ yarn add fastify-prisma
```

### Register the plugin

You have two options for registering the plugin:

1. Use the plugin as-is or pass in your own configs
2. Create a separate client and pass it in (great if you are using a monorepo or other more unique use cases)

**javascript**

```javascript
const { PrismaClient } = require('@prisma/client');
const fastifyPrisma = require('fastify-prisma');

// Default
await fastify.register(fastifyPrisma);

// With client
await fastify.register(fastifyPrisma, {
  client: new PrismaClient();
});

// with options
await fastify.register(fastifyPrisma, {
  clientConfig: {
    log: [{ emit: 'event', level: 'query' }]
  }
});
```

**typescript**

```typescript
import { PrismaClient } from '@prisma/client';
import fastifyPrisma from 'fastify-prisma';

// Default
await fastify.register(fastifyPrisma);

// With client
await fastify.register(fastifyPrisma, {
  client: new PrismaClient();
});

// with options
await fastify.register(fastifyPrisma, {
  clientConfig: {
    log: [{ emit: 'event', level: 'query' }]
  }
});
```

## License

Licensed under MIT.
