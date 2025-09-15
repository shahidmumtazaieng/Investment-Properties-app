// Diagnostic script to check route handling
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Current directory:', __dirname);
console.log('Dist public path:', path.join(__dirname, 'dist/public'));
console.log('Index.html exists:', fs.existsSync(path.join(__dirname, 'dist/public/index.html')));

const app = express();
const port = 3000;

// Log all requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

// Specific routes
app.get('/control-panel', (req, res) => {
  console.log('Handling /control-panel route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.get('/control-panel/login', (req, res) => {
  console.log('Handling /control-panel/login route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.get('/control-panel/*', (req, res) => {
  console.log('Handling /control-panel/* route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Fallback
app.get('*', (req, res) => {
  console.log('Handling fallback route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

const server = createServer(app);

server.listen({ port, host: 'localhost' }, () => {
  console.log(`Diagnostic server running at http://localhost:${port}`);
  console.log('Try accessing:');
  console.log(`  http://localhost:${port}/control-panel/login`);
});