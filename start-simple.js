// start-simple.js
// Ultra simple server to test if the issue is with the configuration

import express from 'express';
import { createServer } from 'http';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Simple server working', port: port });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

const server = createServer(app);

server.listen(port, 'localhost', () => {
  console.log(`Simple server running on port ${port}`);
  console.log(`Test at: http://localhost:${port}/test`);
});

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Try setting PORT=3001`);
  }
});