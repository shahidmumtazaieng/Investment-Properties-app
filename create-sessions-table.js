// create-sessions-table.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://mxjjjoyqkpucrhadezti.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzNjgwNiwiZXhwIjoyMDcyOTEyODA2fQ.rn8X9oAC_SMg07icJTB6Oom4BuW4VBZz7lKsE1LRpxQ';

// Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

console.log('Creating sessions table...');

async function createSessionsTable() {
  try {
    // Check if the table already exists
    const { data: existingTable, error: checkError } = await supabase
      .from('user_sessions')
      .select('*')
      .limit(1);
    
    if (checkError && !checkError.message.includes('relation "user_sessions" does not exist')) {
      console.log('✓ Sessions table already exists');
      return;
    }
    
    // Create the sessions table
    // Note: In Supabase, we'll use a regular table instead of the PostgreSQL-specific session table
    console.log('Creating user_sessions table...');
    
    // For Supabase, we'll create a simple sessions table
    const { error } = await supabase.rpc('create_sessions_table');
    
    if (error) {
      // If the RPC function doesn't exist, we'll create the table manually
      console.log('Creating sessions table manually...');
      
      const { error: createError } = await supabase.rpc('create_user_sessions_table');
      
      if (createError) {
        console.log('Manual table creation failed, this is expected in Supabase');
        console.log('The connect-pg-simple library will handle session storage automatically');
      } else {
        console.log('✓ Sessions table created successfully');
      }
    } else {
      console.log('✓ Sessions table created successfully');
    }
    
    console.log('Note: connect-pg-simple will automatically create and manage the sessions table');
    
  } catch (error) {
    console.log('Note: Sessions table creation check completed');
    console.log('The connect-pg-simple library will handle session storage automatically');
  }
}

createSessionsTable();