// Simple debug script to test route registration
const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');

// Get the directory name for ES modules
const __filename = fileURLToPath(new URL('.', import.meta.url));
const __dirname = path.dirname(__filename);

const app = express();

// Test route registration
console.log('Registering test routes...');

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist/public')));
console.log('Registered static file middleware');

// Test control-panel routes
app.get('/control-panel', (req, res) => {
  console.log('Hit /control-panel route');
  res.send('Control Panel Home');
});

app.get('/control-panel/login', (req, res) => {
  console.log('Hit /control-panel/login route');
  res.send('Control Panel Login');
});

app.get('/control-panel/*', (req, res) => {
  console.log('Hit /control-panel/* route for:', req.params[0]);
  res.send('Control Panel Wildcard');
});

// Fallback route
app.get('*', (req, res) => {
  console.log('Hit fallback route for:', req.path);
  res.send('Fallback route');
});

const port = 3001;
app.listen(port, () => {
  console.log(`Debug server running on port ${port}`);
  console.log('Test URLs:');
  console.log(`- http://localhost:${port}/control-panel`);
  console.log(`- http://localhost:${port}/control-panel/login`);
  console.log(`- http://localhost:${port}/control-panel/test`);
});