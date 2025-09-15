// Script to start both frontend and backend for development
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Investor Properties NY Development Environment...\n');

// Start backend server
console.log('🔧 Starting backend server...');
const backend = spawn('node', ['server-supabase.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '3000'
  }
});

backend.on('error', (error) => {
  console.error('❌ Failed to start backend server:', error.message);
});

backend.on('close', (code) => {
  console.log(`🔧 Backend server exited with code ${code}`);
});

// Start frontend development server
console.log('\n🎨 Starting frontend development server...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: join(__dirname, 'client'),
  stdio: 'inherit'
});

frontend.on('error', (error) => {
  console.error('❌ Failed to start frontend server:', error.message);
});

frontend.on('close', (code) => {
  console.log(`🎨 Frontend server exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development environment...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development environment...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

console.log('\n✅ Development environment startup initiated!');
console.log('   Frontend will be available at: http://localhost:5173');
console.log('   Backend API will be available at: http://localhost:3000');
console.log('   (Note: Frontend proxy should redirect API calls to backend)\n');