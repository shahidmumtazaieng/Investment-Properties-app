// test-tables.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://mxjjjoyqkpucrhadezti.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzNjgwNiwiZXhwIjoyMDcyOTEyODA2fQ.rn8X9oAC_SMg07icJTB6Oom4BuW4VBZz7lKsE1LRpxQ';

// Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

console.log('Testing Supabase tables...');

async function testTables() {
  try {
    // List of expected tables
    const tables = [
      'properties',
      'partners',
      'leads',
      'offers',
      'communications',
      'foreclosure_listings',
      'foreclosure_subscriptions',
      'bid_service_requests',
      'weekly_subscribers',
      'institutional_investors',
      'institutional_sessions',
      'institutional_bid_tracking',
      'institutional_foreclosure_lists',
      'institutional_weekly_deliveries'
    ];
    
    console.log('Checking if required tables exist...\n');
    
    for (const table of tables) {
      try {
        // Try to fetch one record from each table to verify it exists
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: Error - ${error.message}`);
        } else {
          console.log(`✓ ${table}: OK (${Array.isArray(data) ? data.length : 0} records)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Failed - ${err.message}`);
      }
    }
    
    console.log('\n🎉 Table verification complete!');
    
  } catch (error) {
    console.error('Error testing tables:', error);
  }
}

testTables();