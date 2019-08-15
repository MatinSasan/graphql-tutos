import { GraphQLServer } from 'graphql-yoga';

// Demo User data

const users = [
  {
    id: '1',
    name: 'Matin',
    email: 'lol@loland.com',
    age: 27
  },
  {
    id: '2',
    name: 'Mobin',
    email: 'lol2@loland.com',
    age: 26
  },
  {
    id: '3',
    name: 'nobody',
    email: 'ghost@ghost.com'
  }
];

// type definition (schema)
const typeDefs = `

type Query {
  users(query: String): [User!]!
  me: User!
  post: Post!
  greeting(name: String, hobby: String): String!
}

type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}

type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean!
}

`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    greeting(parent, args, ctx, info) {
      if (args.name && args.hobby) {
        return `Hello ${args.name} and I love ${args.hobby} :D`;
      } else if (args.name) {
        return `Hello ${args.name} :D`;
      } else {
        return 'Hello Stranger';
      }
    },
    me() {
      return {
        id: '1234',
        name: 'Matin',
        email: 'lol@loland.com'
      };
    },
    post() {
      return {
        id: '12',
        title: 'graphql',
        body: '',
        published: false
      };
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
