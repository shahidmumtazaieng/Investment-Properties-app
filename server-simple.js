// server-simple.js
// Ultra minimal server to test if the issue is with the environment

import express from 'express';
import { createServer } from 'http';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Simple server is working!',
    port: port,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

const server = createServer(app);

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`   Port ${port} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`   Permission denied for port ${port}`);
  } else if (error.code === 'ENOTSUP') {
    console.error(`   Operation not supported - trying different host`);
    // Try with localhost instead of 0.0.0.0
    server.listen(port, 'localhost', () => {
      console.log(`✅ Server started successfully on localhost:${port}`);
    });
    return;
  }
  process.exit(1);
});

// Start server with better error handling
try {
  server.listen(port, 'localhost', () => {
    console.log(`✅ Server started successfully on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}