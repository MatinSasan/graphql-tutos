import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';
require('dotenv').config();

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const { password: pass } = data;
    if (pass.length < 5) {
      throw new Error('Password must be 5 characters or longer');
    }

    const password = await bcrypt.hash(pass, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password
      }
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.SECRET)
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
      token: jwt.sign({ userId: user.id }, process.env.SECRET)
    };
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
