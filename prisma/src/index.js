import { GraphQLServer, PubSub } from 'graphql-yoga';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';

import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';
import './prisma';

// Demo User data
import db from './fakeData';

// Resolvers
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Post,
  User,
  Comment
};

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db, pubsub }
});

server.start(({ port }) => {
  console.log(`Server is up at port ${port}`);
});
