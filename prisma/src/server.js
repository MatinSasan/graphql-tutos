import { GraphQLServer, PubSub } from 'graphql-yoga';

import prisma from './prisma';

// Resolvers
import { resolvers, fragmentReplacements } from './resolvers/index';
const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(req) {
    return { pubsub, prisma, req };
  },
  fragmentReplacements
});

export default server;
