# fastify-prisma

[![npm version](https://img.shields.io/npm/v/%40joggr/fastify-prisma)](https://www.npmjs.com/package/@joggr/fastify-prisma)
![CI](https://github.com/joggrdocs/fastify-prisma/workflows/CI/badge.svg)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

Fastify Prisma plugin to share the same `PrismaClient` across your entire server.

```typescript
const allTheDucks = await server.prisma.rubberDucky.findMany();
```

## Requirements

- `fastify` >= 5.x
- `@prisma/client` >= 6.x

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

**pnpm**

```shell
pnpm add @joggr/fastify-prisma
```

### Register the plugin

### `javascript`

```javascript
const { PrismaClient } = require('../my-prisma-client');
const fastifyPrisma = require('@joggr/fastify-prisma');

await fastify.register(fastifyPrisma, {
  client: new PrismaClient(),
});
```

### `typescript`

#### Setup

```typescript
import { PrismaClient } from '../my-prisma-client';
import fastifyPrisma from '@joggr/fastify-prisma';

// Add this so you get types across the board
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

await fastify.register(fastifyPrisma, {
  client: new PrismaClient(),
});
```

>[!WARN]
> Make sure you add in the module declaration or you won't have types!

### Accessing the `prisma` client

```typescript
async function somePlugin (server, opts) {
  const ducks = await server.prisma.rubberDucky.findMany();

  // do something with the ducks, log for now
  server.log.warn({ ducks }, "🐥🐥 There are lots of ducks! 🐥🐥");
}
```

> [!TIP]
> You can see a working example of this in the [examples](./examples) directory.

## Version Compatibility

Different versions of this library support different versions of `fastify` and `@prisma/client`. Please use the version you need based on your project's dependencies.

The table below shows the compatibility matrix.

| `@joggrdocs/fastify-prisma` | `fastify` | `@prisma/client`  | status       |
| ---------------------------- | --------- | ---------------- | ------------ |
| `6.x`                        | `5.x`     | `6.x`            | `active`     |
| `5.x`                        | `5.x`     | `6.x`            | `active`     |
| `4.x`                        | `5.x`     | `5.x`            | `deprecated` |
| `1.x` - `3.x`                | `4.x`     | `4.x \|\| 5.x`   | `deprecated` |

## License

Licensed under MIT.

<!-- sign up footer -->
<br>
<hr>
<h2 align="center">
   ⚡️ Want to sign up for Joggr?
</h2>
<p align="center">
    You can sign up for free at our website:  <a href="https://www.joggr.io/signup?utm_source=github&utm_medium=org-readme&utm_campaign=static-docs">https://joggr.io</a><br>
    (or click button below 👇)
</p>
<p align="center">
  <a href="https://www.joggr.io/signup?utm_source=github&utm_medium=org-readme&utm_campaign=static-docs">
    <img src="https://assets.joggr.io/github/badges/signup-badge.svg" width="250px" alt="Sign up" />
  </a>
</p>
<br>
