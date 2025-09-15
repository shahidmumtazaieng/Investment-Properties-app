// Test to check if server starts
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting server test...');

const app = express();
const port = 3001;

// Simple logging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// Serve static files
const publicPath = path.join(__dirname, 'dist/public');
console.log('Public path:', publicPath);
console.log('Index.html exists:', require('fs').existsSync(path.join(publicPath, 'index.html')));

app.use(express.static(publicPath));

// Routes
app.get('/control-panel/login', (req, res) => {
  console.log('Serving control-panel/login');
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/control-panel/*', (req, res) => {
  console.log('Serving control-panel/*');
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('*', (req, res) => {
  console.log('Serving fallback');
  res.sendFile(path.join(publicPath, 'index.html'));
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server test running on port ${port}`);
  console.log(`Try: http://localhost:${port}/control-panel/login`);
});