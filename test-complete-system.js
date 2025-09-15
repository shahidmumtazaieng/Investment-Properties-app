// test-complete-system.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://mxjjjoyqkpucrhadezti.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzNjgwNiwiZXhwIjoyMDcyOTEyODA2fQ.rn8X9oAC_SMg07icJTB6Oom4BuW4VBZz7lKsE1LRpxQ';

// Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

console.log('Testing complete Supabase system...');

async function testCompleteSystem() {
  try {
    console.log('1. Testing database connection...');
    
    // Test basic connection by fetching table names
    const { data: tables, error: tablesError } = await supabase
      .from('properties')
      .select('id, address, neighborhood, borough, price')
      .limit(3);
    
    if (tablesError) {
      console.error('Error fetching properties:', tablesError);
      return;
    }
    
    console.log('✓ Successfully connected to Supabase database');
    console.log(`✓ Found ${tables.length} sample properties`);
    
    // Test fetching foreclosure listings
    console.log('2. Testing foreclosure listings...');
    
    const { data: foreclosureListings, error: foreclosureError } = await supabase
      .from('foreclosure_listings')
      .select('id, address, county, auction_date, starting_bid')
      .limit(3);
    
    if (foreclosureError) {
      console.error('Error fetching foreclosure listings:', foreclosureError);
      return;
    }
    
    console.log('✓ Successfully fetched foreclosure listings');
    console.log(`✓ Found ${foreclosureListings.length} sample foreclosure listings`);
    
    // Test fetching partners
    console.log('3. Testing partners table...');
    
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('id, username, email, first_name, last_name')
      .limit(3);
    
    if (partnersError) {
      console.error('Error fetching partners:', partnersError);
      return;
    }
    
    console.log('✓ Successfully fetched partners');
    console.log(`✓ Found ${partners.length} partners`);
    
    // Test fetching leads
    console.log('4. Testing leads table...');
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, name, email, type, status')
      .limit(3);
    
    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      return;
    }
    
    console.log('✓ Successfully fetched leads');
    console.log(`✓ Found ${leads.length} leads`);
    
    console.log('\n🎉 All tests passed! Supabase integration is working correctly.');
    console.log('\n📊 Summary:');
    console.log(`  - Properties: ${tables.length}`);
    console.log(`  - Foreclosure Listings: ${foreclosureListings.length}`);
    console.log(`  - Partners: ${partners.length}`);
    console.log(`  - Leads: ${leads.length}`);
    
  } catch (error) {
    console.error('❌ Error testing complete system:', error);
  }
}

testCompleteSystem();