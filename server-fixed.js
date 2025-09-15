// server-fixed.js
// A simplified server implementation to avoid the port binding issues

import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { createServer } from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with PostgreSQL store
const PgSession = pgSession(session);

app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: "user_sessions"
  }),
  secret: process.env.SESSION_SECRET || "investor-properties-ny-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
const distPath = path.resolve(__dirname, 'dist/public');
app.use(express.static(distPath));

// Simple API routes for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running correctly' });
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Start server with better error handling
const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || 'localhost';

const server = createServer(app);

server.listen(port, host, () => {
  console.log(`🚀 Server running on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});