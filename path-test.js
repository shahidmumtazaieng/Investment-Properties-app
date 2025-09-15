import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('__dirname:', __dirname);

// Test the path that the server is using
const distPath = resolve(__dirname, 'dist', 'public');
console.log('distPath:', distPath);
console.log('distPath exists:', existsSync(distPath));

if (existsSync(distPath)) {
  console.log('Contents of dist/public:');
  console.log(readdirSync(distPath));
  
  const indexPath = join(distPath, 'index.html');
  console.log('index.html path:', indexPath);
  console.log('index.html exists:', existsSync(indexPath));
}