// verify-configuration.js
// Script to verify that all configurations are working correctly

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

console.log('🔍 Verifying server configuration...\n');

// Check environment variables
console.log('1. Checking environment variables...');
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DATABASE_URL', 'SESSION_SECRET'];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.log(`❌ Missing environment variables: ${missingEnvVars.join(', ')}`);
} else {
  console.log('✅ All required environment variables are present');
}

// Test Supabase connection
console.log('\n2. Testing Supabase connection...');

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Test a simple query
    setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id')
          .limit(1);
        
        if (error) {
          console.log('❌ Supabase connection failed:', error.message);
        } else {
          console.log('✅ Supabase connection successful');
        }
      } catch (error) {
        console.log('❌ Supabase connection test failed:', error.message);
      }
    }, 1000);
  } catch (error) {
    console.log('❌ Supabase client initialization failed:', error.message);
  }
} else {
  console.log('❌ Supabase credentials not found in environment variables');
}

// Test database URL
console.log('\n3. Checking database URL...');
if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL is configured');
  // Basic format check
  if (process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.log('✅ DATABASE_URL format looks correct');
  } else {
    console.log('⚠️  DATABASE_URL format might be incorrect');
  }
} else {
  console.log('❌ DATABASE_URL is not configured');
}

// Test session secret
console.log('\n4. Checking session configuration...');
if (process.env.SESSION_SECRET) {
  console.log('✅ SESSION_SECRET is configured');
  if (process.env.SESSION_SECRET.length >= 32) {
    console.log('✅ SESSION_SECRET length is sufficient');
  } else {
    console.log('⚠️  SESSION_SECRET should be at least 32 characters for security');
  }
} else {
  console.log('❌ SESSION_SECRET is not configured');
}

console.log('\n📋 Configuration verification complete!');
console.log('\nTo start the server, run one of these commands:');
console.log('  npm run start');
console.log('  npm run start:windows');
console.log('  npm run start:robust');