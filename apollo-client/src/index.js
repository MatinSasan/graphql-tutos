import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`;

client.query({ query: getUsers }).then(res => {
  let html = '';

  res.data.users.forEach(user => {
    html += `
        <div>
          <h1>${user.name}</h1>
        </div>
      `;
  });

  document.getElementById('users').innerHTML = html;
});

const getPosts = gql`
  query {
    posts {
      title
      author {
        name
      }
    }
  }
`;

client.query({ query: getPosts }).then(res => {
  let html = '';
  res.data.posts.forEach(post => {
    html += `
      <div>
        <h1>${post.title}</h1>
      </div>
    `;
  });
  document.getElementById('posts').innerHTML = html;
});
