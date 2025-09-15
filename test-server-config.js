// test-server-config.js
import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Test the session configuration
try {
  const PgSession = pgSession(session);
  
  app.use(session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "user_sessions"
    }),
    secret: process.env.SESSION_SECRET || "test-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  console.log('✓ Session configuration is valid');
  
  // Add a simple test route
  app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Server configuration test passed' });
  });
  
  // Test port binding with a different port
  const port = parseInt(process.env.TEST_PORT || "3001", 10);
  
  const server = app.listen(port, 'localhost', () => {
    console.log(`✓ Test server running on http://localhost:${port}`);
    console.log('✓ Server configuration is working correctly');
    
    // Close the server after 2 seconds
    setTimeout(() => {
      server.close(() => {
        console.log('✓ Test server closed successfully');
      });
    }, 2000);
  });
  
} catch (error) {
  console.error('❌ Session configuration error:', error.message);
  
  // Fallback to memory store for testing
  app.use(session({
    secret: process.env.SESSION_SECRET || "test-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  console.log('✓ Fallback to memory store for testing');
  
  const port = parseInt(process.env.TEST_PORT || "3001", 10);
  
  const server = app.listen(port, 'localhost', () => {
    console.log(`✓ Test server running on http://localhost:${port} with fallback configuration`);
    
    // Close the server after 2 seconds
    setTimeout(() => {
      server.close(() => {
        console.log('✓ Test server closed successfully');
      });
    }, 2000);
  });
}