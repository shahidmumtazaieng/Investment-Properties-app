// Fixed server implementation with proper route handling
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static files FIRST
const publicDir = path.join(__dirname, 'dist', 'public');
console.log('Serving static files from:', publicDir);
app.use(express.static(publicDir));

// API Routes (these come BEFORE the catch-all routes)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Admin API routes
app.post('/api/admin/login', (req, res) => {
  // Simple demo login - in production, implement proper authentication
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      token: 'admin-secret-token',
      user: { id: 'admin-1', username: 'admin', role: 'administrator' }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/admin/me', (req, res) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === 'admin-secret-token') {
      return res.json({
        success: true,
        user: { id: 'admin-1', username: 'admin', role: 'administrator' }
      });
    }
  }
  res.status(401).json({ message: 'Unauthorized' });
});

// Specific routes for React app (these come AFTER static files but BEFORE catch-all)
app.get('/control-panel/login', (req, res) => {
  console.log('Serving control-panel/login');
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/control-panel/*', (req, res) => {
  console.log('Serving control-panel/*');
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Other specific pages
app.get('/blog', (req, res) => {
  console.log('Serving blog');
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/join-buyers', (req, res) => {
  console.log('Serving join-buyers');
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Catch-all route for React Router (this MUST be last)
app.get('*', (req, res) => {
  console.log('Serving catch-all route');
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const port = parseInt(process.env.PORT || '3001', 10);
const server = createServer(app);

server.listen({ port, host: 'localhost' }, () => {
  console.log(`Fixed server running on port ${port}`);
  console.log('Available URLs:');
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://localhost:${port}/control-panel/login`);
  console.log(`  http://localhost:${port}/control-panel/dashboard`);
  console.log(`  http://localhost:${port}/blog`);
  console.log(`  http://localhost:${port}/join-buyers`);
});

export { server };