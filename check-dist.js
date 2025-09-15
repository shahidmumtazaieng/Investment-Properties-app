// check-dist.js
// Script to check if there are any issues with the dist/index.js file

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distIndexPath = path.join(__dirname, 'dist', 'index.js');

console.log('🔍 Checking dist/index.js file...\n');

// Check if file exists
if (!fs.existsSync(distIndexPath)) {
  console.log('❌ dist/index.js file does not exist');
  process.exit(1);
}

// Read file content
try {
  const content = fs.readFileSync(distIndexPath, 'utf8');
  console.log('✅ dist/index.js file exists');
  console.log(`📄 File size: ${(content.length / 1024).toFixed(2)} KB`);
  
  // Check for common issues
  if (content.includes('0.0.0.0:5000')) {
    console.log('⚠️  Found reference to 0.0.0.0:5000 in the file');
  }
  
  if (content.includes('port 5000')) {
    console.log('⚠️  Found reference to port 5000 in the file');
  }
  
  // Check for server.listen
  const listenMatches = content.match(/server\.listen/g);
  if (listenMatches) {
    console.log(`✅ Found ${listenMatches.length} server.listen calls`);
  } else {
    console.log('❌ No server.listen calls found');
  }
  
  // Check for createServer
  const createServerMatches = content.match(/createServer/g);
  if (createServerMatches) {
    console.log(`✅ Found ${createServerMatches.length} createServer calls`);
  } else {
    console.log('❌ No createServer calls found');
  }
  
  console.log('\n📋 File check complete');
  
} catch (error) {
  console.error('❌ Error reading dist/index.js:', error.message);
  process.exit(1);
}