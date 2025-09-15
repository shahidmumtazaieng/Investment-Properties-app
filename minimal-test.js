// Minimal test to check if server can start
import express from 'express';
import { createServer } from 'http';

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/control-panel/login', (req, res) => {
  res.send('Admin Login Page');
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`Minimal server running on port ${port}`);
  console.log(`Visit: http://localhost:${port}/control-panel/login`);
});