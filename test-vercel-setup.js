// Test script to verify Vercel setup
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing Vercel setup...');

const app = express();
const port = 3000;

// Test static file serving
const publicDir = path.join(__dirname, 'dist', 'public');
console.log('Public directory path:', publicDir);
console.log('Index.html exists:', require('fs').existsSync(path.join(publicDir, 'index.html')));

// Simple route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Vercel setup test successful', timestamp: new Date().toISOString() });
});

// Test export
export default app;

console.log('Vercel setup test completed successfully');