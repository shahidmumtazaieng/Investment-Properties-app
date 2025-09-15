// Minimal server to test route handling
const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const port = 3000;

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

// Admin routes
app.get('/control-panel', (req, res) => {
  console.log('Serving control-panel index');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.get('/control-panel/login', (req, res) => {
  console.log('Serving control-panel login');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.get('/control-panel/*', (req, res) => {
  console.log('Serving control-panel wildcard');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Fallback for React Router
app.get('*', (req, res) => {
  console.log('Serving fallback');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

const server = createServer(app);

server.listen({ port, host: 'localhost' }, () => {
  console.log(`Minimal server running on port ${port}`);
  console.log(`Test URLs:`);
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://localhost:${port}/control-panel`);
  console.log(`  http://localhost:${port}/control-panel/login`);
});