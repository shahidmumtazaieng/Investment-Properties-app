// app.js
// Complete standalone application implementation

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

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
if (process.env.DATABASE_URL) {
  try {
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
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));
  } catch (error) {
    console.warn('⚠️  Failed to initialize PostgreSQL session store, using memory store:', error.message);
    app.use(session({
      secret: process.env.SESSION_SECRET || "investor-properties-ny-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));
  }
} else {
  console.warn('⚠️  DATABASE_URL not found, using memory store for sessions');
  app.use(session({
    secret: process.env.SESSION_SECRET || "investor-properties-ny-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
}

// Serve static files
const publicPath = path.resolve(__dirname, 'dist/public');
app.use(express.static(publicPath));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working correctly' });
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Application error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ 
    error: true,
    message,
    status
  });
});

// Create HTTP server
const server = createServer(app);

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`   Port ${port} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`   Permission denied for port ${port}`);
  } else if (error.code === 'ENOTSUP') {
    console.error(`   Operation not supported - this might be a Windows issue`);
    console.error(`   Trying with different configuration...`);
  }
  
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Start server
const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || 'localhost';

server.listen(port, host, () => {
  console.log(`🚀 Server started successfully!`);
  console.log(`🌐 URL: http://${host}:${port}`);
  console.log(`🏥 Health check: http://${host}:${port}/api/health`);
  console.log(`⏱️  Started at: ${new Date().toISOString()}`);
});

export { app, server };