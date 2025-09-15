// Simple route test
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; // Use a different port to avoid conflicts

// Simple route to test if server is working
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Admin routes
app.get('/control-panel/login', (req, res) => {
  res.send('Admin login page');
});

app.get('/control-panel/*', (req, res) => {
  res.send('Admin panel');
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`Simple test server running on port ${port}`);
  console.log(`Test URLs:`);
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://localhost:${port}/control-panel/login`);
  console.log(`  http://localhost:${port}/control-panel/dashboard`);
});