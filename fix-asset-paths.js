// Script to fix asset paths in index.html for proper deployment
import fs from 'fs';
import path from 'path';

// Try multiple possible paths for index.html
const possiblePaths = [
  path.join(process.cwd(), '..', 'dist', 'public', 'index.html'),  // When in client directory
  path.join(process.cwd(), 'dist', 'public', 'index.html'),        // When in root directory
  path.join(process.cwd(), 'index.html')                           // Fallback
];

function findIndexHtml() {
  for (const indexPath of possiblePaths) {
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }
  return null;
}

const indexPath = findIndexHtml();

if (!indexPath) {
  console.error('❌ Could not find index.html in any expected location');
  console.log('Searched in:');
  possiblePaths.forEach(p => console.log('  -', p));
  process.exit(1);
}

console.log('✅ Found index.html at:', indexPath);

// Read the index.html file
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    process.exit(1);
  }

  // Replace absolute paths with relative paths
  let result = data.replace(/src="\/assets\//g, 'src="./assets/');
  result = result.replace(/href="\/assets\//g, 'href="./assets/');

  // Write the fixed content back to file
  fs.writeFile(indexPath, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing index.html:', err);
      process.exit(1);
    }
    
    console.log('✅ Asset paths fixed in index.html');
    console.log('✅ Using relative paths for proper deployment');
  });
});
