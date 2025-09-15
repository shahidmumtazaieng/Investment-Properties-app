import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, statSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Use the same path as the main server
const distPath = path.resolve(__dirname, 'dist', 'public');
console.log('Dist path:', distPath);
console.log('Dist path exists:', existsSync(distPath));

if (existsSync(distPath)) {
  // Serve static files with the same configuration
  app.use(express.static(distPath, {
    index: 'index.html',
    maxAge: '1d'
  }));
  
  // Test route to see if assets are served
  app.get('/test-assets', (req, res) => {
    res.send(`
      <html>
        <head>
          <link rel="stylesheet" href="/assets/index-BYRpMt7I.css">
        </head>
        <body>
          <h1>Test Assets</h1>
          <script type="module" src="/assets/index-D9CtPI7t.js"></script>
        </body>
      </html>
    `);
  });
  
  app.listen(port, 'localhost', () => {
    console.log(`Test static server listening at http://localhost:${port}`);
    console.log(`Test assets at http://localhost:${port}/test-assets`);
  });
} else {
  console.error('Dist path does not exist!');
}