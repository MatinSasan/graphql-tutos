import { GraphQLServer } from 'graphql-yoga';

// Demo User data
import { users, posts, comments } from './fakeData';

// type definition (schema)
const typeDefs = `

type Query {
  users(query: String): [User!]!
  posts(query: String): [Post!]!
  comments: [Comment!]!
  me: User!
  post: Post!
  greeting(name: String, hobby: String): String!
}

type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post]!
  comments: [Comment!]!
}

type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean!
  author: User!
  comments:[Comment!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
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
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(user => {
        return post.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
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
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, argss, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
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
