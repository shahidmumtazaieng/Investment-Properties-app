const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Use absolute path
const distPath = path.join(__dirname, 'dist', 'public');
console.log('Dist path:', distPath);
console.log('Dist path exists:', fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  console.log('Contents:', fs.readdirSync(distPath));
  
  // Serve static files
  app.use(express.static(distPath));
  
  // Serve index.html for all routes
  app.get('*', (req, res) => {
    console.log('Request for:', req.path);
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  app.listen(port, 'localhost', () => {
    console.log(`Test server listening at http://localhost:${port}`);
  });
} else {
  console.error('Dist path does not exist!');
}