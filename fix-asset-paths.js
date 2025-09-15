// Script to fix asset paths in index.html for proper deployment
import fs from 'fs';
import path from 'path';

const indexPath = path.join(process.cwd(), 'dist', 'public', 'index.html');

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