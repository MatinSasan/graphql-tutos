import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

// prisma.query.users(null, '{ id name email posts { id title }}').then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, '{id author text}').then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    '{ id }'
  );

  const user = await prisma.query.user(
    {
      where: {
        id: authorId
      }
    },
    '{ id name email posts { id title published } }'
  );

  return user;
};

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    '{ author { id } }'
  );

  const user = await prisma.query.user(
    {
      where: {
        id: post.author.id
      }
    },
    '{ id name email posts { id title published }}'
  );

  return user;
};

// createPostForUser('cjzjlnqlm00700715edug3ak7', {
//   title: 'great books',
//   body: 'Wisdom of Life',
//   published: true
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2));
// });

updatePostForUser('cjzl18h7800f407159r0fw3g2', { published: false }).then(
  user => console.log(JSON.stringify(user, undefined, 2))
);
