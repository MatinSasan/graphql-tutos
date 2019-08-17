import { GraphQLServer } from 'graphql-yoga';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

// Demo User data
import db from './fakeData';

// Resolvers
const resolvers = {
  Query,
  Mutation,
  Post,
  User,
  Comment
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db }
});

server.start(({ port }) => {
  console.log(`Server is up at port ${port}`);
});
