import express from 'express';

const server = express();

server.get('/', (req, res) => {
  res.send('online');
});

const port = 3000;
server.listen(port, () => {
  console.log('Application listening on ', port);
});
