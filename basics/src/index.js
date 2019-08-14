import { GraphQLServer } from 'graphql-yoga';

// type definition (schema)
const typeDefs = `

type Query {
  hello: String!
  name: String!
  location: String!
  bio: String!
}

`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'hello there :D';
    },
    name() {
      return 'Matin';
    },
    location() {
      return 'Iran';
    },
    bio() {
      return 'A wandering seeker';
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(({ port }) => {
  console.log(`Server is up at port ${port}`);
});
