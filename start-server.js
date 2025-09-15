// start-server.js
// Simple script to start the server

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Investor Properties NY server...');

// Change to the project directory
const projectDir = path.resolve(__dirname);

// Start the server
const server = spawn('node', ['server-supabase.js'], {
  cwd: projectDir,
  stdio: 'inherit'
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

console.log('Server started. Visit http://localhost:3000/admin/login to test the admin routing fix.');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.kill('SIGTERM');
});