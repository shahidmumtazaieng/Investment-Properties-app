// Test server to check route handling
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist/public')));

// Admin routes
app.get('/control-panel', (req, res) => {
  console.log('Serving /control-panel route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.get('/control-panel/login', (req, res) => {
  console.log('Serving /control-panel/login route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.get('/control-panel/*', (req, res) => {
  console.log('Serving /control-panel/* route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Other specific routes
app.get('/blog', (req, res) => {
  console.log('Serving /blog route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.get('/join-buyers', (req, res) => {
  console.log('Serving /join-buyers route');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  console.log('Serving fallback route for:', req.path);
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

const server = createServer(app);

server.listen({ port, host: 'localhost' }, () => {
  console.log(`Test server running on port ${port}`);
  console.log('Available URLs:');
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://localhost:${port}/control-panel`);
  console.log(`  http://localhost:${port}/control-panel/login`);
  console.log(`  http://localhost:${port}/blog`);
  console.log(`  http://localhost:${port}/join-buyers`);
});