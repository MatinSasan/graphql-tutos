import uuidv4 from 'uuid/v4';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    return await prisma.mutation.createUser({ data: args.data }, info);
  },
  async deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  async createPost(parent, { data }, { prisma }, info) {
    const { title, body, published, author } = data;

    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: {
            connect: {
              id: author
            }
          }
        }
      },
      info
    );
  },
  async deletePost(parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id }, info });
  },
  async updatePost(parent, { data, id }, { prisma }, info) {
    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  async createComment(parent, { data }, { prisma }, info) {
    const { author, post, text } = data;
    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: { connect: { id: author } },
          post: { connect: { id: post } }
        }
      },
      info
    );
  },
  async deleteComment(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  async updateComment(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment({ where: { id }, data }, info);
  }
};

export default Mutation;
