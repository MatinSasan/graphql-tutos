import 'cross-fetch/polyfill';
import '@babel/polyfill';
// require('@babel/polyfill/noConflict'); //this was required for 'ReferenceError: regeneratorRuntime'
import ApolloBoost, { gql } from 'apollo-boost';
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Mat", email: "lol6@lol.com", password: "12345" }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const res = await client.mutate({
    mutation: createUser
  });

  const itExists = await prisma.exists.User({
    id: res.data.createUser.user.id
  });
  expect(itExists).toBe(true);
});
