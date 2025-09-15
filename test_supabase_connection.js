// test_supabase_connection.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://mxjjjoyqkpucrhadezti.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzNjgwNiwiZXhwIjoyMDcyOTEyODA2fQ.rn8X9oAC_SMg07icJTB6Oom4BuW4VBZz7lKsE1LRpxQ';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testConnection() {
  try {
    // Test basic connection: query system tables to list available tables
    const { data, error } = await supabase.from('pg_tables').select('tablename').eq('schemaname', 'public').limit(5);
    if (error) throw error;
    console.log('Connection successful! Available public tables:', data.map(row => row.tablename));
    
    // Test select from properties table (expect 0 if empty)
    const { data: props, error: propError } = await supabase.from('properties').select('count', { count: 'exact' });
    if (propError && propError.code !== '42P01') throw propError; // Ignore "table not found" for now
    console.log('Properties table accessible. Current count:', props ? props[0]?.count || 0 : 'N/A');
  } catch (error) {
    console.error('Connection failed:', error.message);
    if (error.code === '42P01') console.log('Note: Tables may not exist yet – run schema migrations.');
  }
}

testConnection();