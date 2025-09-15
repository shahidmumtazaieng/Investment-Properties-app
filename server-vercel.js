// Vercel-compatible server
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Vercel-specific modules
import express from 'express';
import session from 'express-session';
import { createServer } from 'http';

// Create app
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

// Serve static files
const publicDir = path.join(__dirname, 'dist', 'public');
app.use(express.static(publicDir));

// API Routes
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

// Specific routes for React app
app.get('/control-panel/login', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/control-panel/*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Other specific pages
app.get('/blog', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/join-buyers', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Export for Vercel
export default app;