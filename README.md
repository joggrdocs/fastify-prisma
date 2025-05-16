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

You have two options for registering the plugin:

1. Use the plugin as-is or pass in your own configs
2. Create a separate client and pass it in (great if you are using a monorepo or other more unique use cases)

### `javascript`

If you are not using typescript just import the client from where ever you have it defined as 
the output in `prisma.schema`.

```javascript
const { PrismaClient } = require('../my-prisma-client');
const fastifyPrisma = require('@joggr/fastify-prisma');

await fastify.register(fastifyPrisma, {
  client: new PrismaClient(),
});
```

### `typescript`

#### Setup

##### 1. Update your `tsconfig.json`

You need to update your `tsconfig.json` to map the `compilerOptions.path` to match the output of the generated `PrismaClient`, by
proxying the `@prisma/client` "package" to the output you defined in your `prisma.schema`.

```javascript
{
  "compilerOptions": {
    ...
    "paths": {
      // For types to work this must match `@prisma/client`
      "@prisma/client": ["./prisma/client"]
    }
  }
}
```

##### 2. Pass in the client instance

```typescript
import { PrismaClient } from '@prisma/client';
import fastifyPrisma from '@joggr/fastify-prisma';

await fastify.register(fastifyPrisma, {
  client: new PrismaClient(),
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

> [!TIP]
> You can see a working example of this in the [examples/ts-custom-output-esm](./examples/ts-custom-output-esm) directory.

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
