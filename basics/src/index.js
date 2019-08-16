import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
// Demo User data
// import { users, posts, comments } from './fakeData';

export let users = [
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

export let posts = [
  {
    id: '10',
    title: 'learning graphql',
    body: 'have to fill this body',
    published: true,
    author: '1'
  },
  {
    id: '11',
    title: 'feeling graphql',
    body: 'have to fill this body again',
    published: true,
    author: '2'
  },
  {
    id: '12',
    title: 'mastering graphql',
    body: 'mastering something takes time',
    published: true,
    author: '3'
  }
];

export let comments = [
  {
    id: '101',
    text: 'this is some stupid comment',
    author: '3',
    post: '10'
  },
  {
    id: '102',
    text: 'this is some smartass comment',
    author: '2',
    post: '11'
  },
  {
    id: '103',
    text: 'this is some empty comment',
    author: '1',
    post: '10'
  },
  {
    id: '104',
    text: 'this is some lovely comment',
    author: '3',
    post: '12'
  }
];

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

type Mutation {
  createUser(data: CreateUserInput!): User!
  deleteUser(id: ID!): User!
  createPost(data: CreatePostInput!): Post!
  createComment(data: CreateCommentInput!): Comment!
}

input CreateUserInput {
  name: String!
  email: String!
  age: Int
}

input CreatePostInput {
  title: String!
  body: String!
  published: Boolean!
  author: ID!
}

input CreateCommentInput {
  text: String!
  author: ID!
  post: ID!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User does not exist');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      const postExists = posts.some(
        post => post.id === args.data.post && post.published
      );

      if (!userExists || !postExists) {
        throw new Error('User or post cannot be found');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      comments.push(comment);

      return comment;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUser = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !match;
      });

      comments = comments.filter(comment => comment.author !== args.id);

      return deletedUser[0];
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
