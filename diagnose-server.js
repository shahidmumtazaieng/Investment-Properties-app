// diagnose-server.js
// Diagnostic script to check what's causing the port binding issue

import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Diagnosing server configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  PORT:', process.env.PORT || 'not set (default: 3000)');
console.log('  HOST:', process.env.HOST || 'not set (default: localhost)');

// Test simple server creation
console.log('\nTesting simple server creation...');

try {
  const app = express();
  
  app.get('/', (req, res) => {
    res.json({ message: 'Test server working' });
  });
  
  app.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint working' });
  });
  
  const server = createServer(app);
  
  // Test binding to different hosts
  const port = parseInt(process.env.PORT || '3000', 10);
  const hosts = ['localhost', '127.0.0.1', '0.0.0.0'];
  
  console.log(`\nTesting binding to port ${port}...`);
  
  let success = false;
  
  for (const host of hosts) {
    try {
      console.log(`  Trying ${host}:${port}...`);
      await new Promise((resolve, reject) => {
        const testServer = server.listen(port, host, () => {
          console.log(`  ✅ Successfully bound to ${host}:${port}`);
          testServer.close(() => {
            console.log(`  ✅ Closed test server on ${host}:${port}`);
            resolve();
          });
        });
        
        testServer.on('error', (err) => {
          console.log(`  ❌ Failed to bind to ${host}:${port} - ${err.message}`);
          reject(err);
        });
        
        // Timeout after 2 seconds
        setTimeout(() => {
          testServer.close();
          reject(new Error('Timeout'));
        }, 2000);
      });
      
      success = true;
      break;
    } catch (error) {
      console.log(`  ❌ Error with ${host}: ${error.message}`);
    }
  }
  
  if (success) {
    console.log('\n🎉 Server binding test successful!');
    console.log('The issue is likely in the main application code.');
  } else {
    console.log('\n❌ Server binding test failed!');
    console.log('There may be a system-level issue with port binding.');
  }
  
} catch (error) {
  console.error('❌ Diagnostic test failed:', error.message);
}

console.log('\n📋 Diagnostic complete.');