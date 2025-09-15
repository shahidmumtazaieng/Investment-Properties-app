import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Use the same path as the main server
const distPath = path.resolve(__dirname, 'dist', 'public');
console.log('Dist path:', distPath);
console.log('Dist path exists:', existsSync(distPath));

if (existsSync(distPath)) {
  // Add logging for all requests
  app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.path}`);
    next();
  });
  
  // Serve static files with the same configuration
  app.use(express.static(distPath, {
    index: 'index.html',
    maxAge: '1d'
  }));
  
  // Specific route to check if assets are being served
  app.get('/assets/:file', (req, res) => {
    const filePath = path.join(distPath, 'assets', req.params.file);
    console.log('Asset request:', req.params.file, 'Path:', filePath);
    if (existsSync(filePath)) {
      console.log('Asset exists, serving...');
      res.sendFile(filePath);
    } else {
      console.log('Asset not found');
      res.status(404).send('Asset not found');
    }
  });
  
  // Admin routes - serve index.html for admin paths
  app.get("/admin", (req, res) => {
    console.log("Serving index.html for /admin");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
  
  app.get("/admin/login", (req, res) => {
    console.log("Serving index.html for /admin/login");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
  
  app.get("/admin/*", (req, res) => {
    console.log("Serving index.html for /admin/*");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
  
  app.use("*", (req, res) => {
    console.log("Serving index.html for catch-all route");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
  
  app.listen(port, 'localhost', () => {
    console.log(`Diagnostic server listening at http://localhost:${port}`);
    console.log('Try accessing http://localhost:3000/admin to test the admin panel');
  });
} else {
  console.error('Dist path does not exist!');
}