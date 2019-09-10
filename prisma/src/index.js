import server from './server';

server.start(({ port }) => {
  console.log(`Server is up at port ${port}`);
});
