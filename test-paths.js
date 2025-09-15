const path = require('path');
const fs = require('fs');

console.log('Current working directory:', process.cwd());

// Check the dist path that the server is using
const distPath = path.resolve(__dirname, 'dist', 'public');
console.log('Expected dist path:', distPath);
console.log('Exists:', fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  console.log('Contents of dist/public:');
  console.log(fs.readdirSync(distPath));
  
  if (fs.existsSync(path.join(distPath, 'assets'))) {
    console.log('Contents of dist/public/assets:');
    console.log(fs.readdirSync(path.join(distPath, 'assets')));
  }
}

// Check the path that the server code is using
const serverDistPath = path.resolve(__dirname, 'dist', 'public');
console.log('Server dist path:', serverDistPath);
console.log('Server dist path exists:', fs.existsSync(serverDistPath));