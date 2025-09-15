// Route debugging script
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

console.log('Starting route debug server...');

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static files FIRST
const publicDir = path.join(__dirname, 'dist', 'public');
console.log('Public directory:', publicDir);
console.log('Index.html exists:', require('fs').existsSync(path.join(publicDir, 'index.html')));

app.use(express.static(publicDir));

// Define routes AFTER static files
app.get('/control-panel/login', (req, res) => {
  console.log('Matched /control-panel/login route');
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/control-panel/*', (req, res) => {
  console.log('Matched /control-panel/* route');
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Fallback route
app.get('*', (req, res) => {
  console.log('Matched fallback route');
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Route debug server listening on port ${port}`);
  console.log('Test URLs:');
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://localhost:${port}/control-panel/login`);
  console.log(`  http://localhost:${port}/control-panel/dashboard`);
});