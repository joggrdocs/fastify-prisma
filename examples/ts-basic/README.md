# fastify-prisma: Basic Example

A basic (typescript) example using the fastify-prisma plugin.

## Running the Server

If you want to run the basic example and see the plugin in action follow the steps below.

### Requirements

- docker-compose@v3
- docker@20+

### Steps

1. Clone the repo locally `git clone git@github.com:joggrdocs/fastify-prisma.git`
2. Start the database `docker-compose up -d`
3. Install dependencies `npm i`
4. Run migrations `npm run prisma migrate deploy`
5. Run the server `npm start`
