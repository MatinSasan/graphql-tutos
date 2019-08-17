const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter(user => {
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
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter(user => {
      return post.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
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

export default Query;