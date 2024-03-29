import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import hashPass from '../utils/hashPass';
import generateToken from '../utils/generateToken';
require('dotenv').config();

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const { password: pass } = data;
    const password = await hashPass(pass);
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password
      }
    });

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async login(parent, { data }, { prisma }, info) {
    const { email, password } = data;

    const user = await prisma.query.user({ where: { email } });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async deleteUser(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  async updateUser(parent, { data }, { prisma, req }, info) {
    const userId = getUserId(req);
    if (typeof data.password === 'string') {
      data.password = await hashPass(data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data
      },
      info
    );
  },
  async createPost(parent, { data }, { prisma, req }, info) {
    const { title, body, published } = data;

    const userId = getUserId(req);

    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, req }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: { id: userId }
    });
    if (!postExists) throw new Error('Unable to delete post');
    return prisma.mutation.deletePost({ where: { id: args.id }, info });
  },
  async updatePost(parent, { data, id }, { prisma, req }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id,
      author: { id: userId }
    });
    const isPublished = await prisma.exists.Post({ id, published: true });

    if (!postExists) throw new Error('Unable to update post');
    if (isPublished && data.published === false) {
      await prisma.mutation.deleteManyComments({ where: { post: { id } } });
    }
    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  async createComment(parent, { data }, { prisma, req }, info) {
    const { post, text } = data;
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id: post,
      published: true
    });
    if (!postExists) throw new Error('Unable to find post');

    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: { connect: { id: userId } },
          post: { connect: { id: post } }
        }
      },
      info
    );
  },
  async deleteComment(parent, { id }, { prisma, req }, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({
      id,
      author: { id: userId }
    });
    if (!commentExists) throw new Error('Unable to delete comment');
    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  async updateComment(parent, { id, data }, { prisma }, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({
      id,
      author: { id: userId }
    });
    if (!commentExists) throw new Error('Unable to update comment');
    return prisma.mutation.updateComment({ where: { id }, data }, info);
  }
};

export default Mutation;
