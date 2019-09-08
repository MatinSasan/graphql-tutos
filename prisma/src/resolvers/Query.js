import getUserId from '../utils/getUserId';

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
          // they shouldn't be able to query for email
        ]
      };
    }

    return prisma.query.users(opArgs, info);
  },
  myPost(parent, { query, first, skip, after }, { prisma, req }, info) {
    const userId = getUserId(req);
    const opArgs = {
      first,
      skip,
      after,
      where: {
        author: { id: userId }
      }
    };

    if (query) {
      opArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      where: {
        published: true
      }
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, { first, skip, after }, { prisma }, info) {
    const opArgs = {
      first,
      skip,
      after
    };
    return prisma.query.comments(opArgs, info);
  },
  async post(parent, { id }, { prisma, req }, info) {
    const userId = getUserId(req, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length === 0) {
      throw new Error('Post not found');
    }

    return posts[0];
  }
};

export default Query;
