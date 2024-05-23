# fastify-prisma

![CI](https://github.com/joggrdocs/fastify-prisma/workflows/CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/%40joggr/fastify-prisma)](https://www.npmjs.com/package/@joggr/fastify-prisma)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/standard/semistandard)

Fastify Prisma plugin to share the same `PrismaClient` across your entire server.

```typescript
const allTheDucks = await server.prisma.rubberDucky.findMany();
```

## Getting Started

Before using this plugin you will need to have [`prisma`](https://www.prisma.io/docs/getting-started) set up. Once you are all set with `prisma` install the package and register the plugin on your server.

### Install the package

**npm**

```shell
npm i @joggr/fastify-prisma
```

**yarn**

```shell
yarn add @joggr/fastify-prisma
```

### Register the plugin

You have two options for registering the plugin:

1. Use the plugin as-is or pass in your own configs
2. Create a separate client and pass it in (great if you are using a monorepo or other more unique use cases)

**javascript**

```javascript
const { PrismaClient } = require('@prisma/client');
const fastifyPrisma = require('@joggr/fastify-prisma');

// Default
await fastify.register(fastifyPrisma);

// With client
await fastify.register(fastifyPrisma, {
  client: new PrismaClient(),
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
import fastifyPrisma from '@joggr/fastify-prisma';

// Default
await fastify.register(fastifyPrisma);

// With client
await fastify.register(fastifyPrisma, {
  client: new PrismaClient(),
});

// with options
await fastify.register(fastifyPrisma, {
  clientConfig: {
    log: [{ emit: 'event', level: 'query' }]
  }
});
```
### Accessing the `prisma` client

```typescript

async function somePlugin (server, opts) {
  const ducks = await server.prisma.rubberDucky.findMany();

  // do something with the ducks, log for now
  server.log.warn({ ducks }, "🐥🐥 There are lots of ducks! 🐥🐥");
}

```

## License

Licensed under MIT.

<br>
<hr>
<h2 align="center">
    Want to sign up for Joggr?
</h2>
<p align="center">
    We'd love to have you join, but we are in closed beta. <br> You can join our waitlist below.
</p>
<p align="center">
    <a href="https://www.joggr.io/closed-beta-waitlist?utm_source=github&utm_medium=org-readme&utm_campaign=static-docs" alt="Join the Waitlist">
        <img src="https://storage.googleapis.com/joggr-public-assets/github/badges/join-waitlist-badge.svg" width="250px" />
    </a>
</p>

