import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

// Use the same configuration as in supabase-storage.js
const supabaseUrl = process.env.SUPABASE_URL || 'https://mxjjjoyqkpucrhadezti.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzNjgwNiwiZXhwIjoyMDcyOTEyODA2fQ.rn8X9oAC_SMg07icJTB6Oom4BuW4VBZz7lKsE1LRpxQ';

console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key exists:', !!supabaseServiceRoleKey);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Test the connection by trying to fetch a simple record
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Try to get a simple count of users (or any table)
    const { data, error } = await supabase
      .from('users')
      .select('count()', { count: 'exact' });
      
    if (error) {
      console.error('Supabase connection error:', error);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Users count:', data);
  } catch (err) {
    console.error('Connection test failed:', err);
  }
}

testConnection();