// test-supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://mxjjjoyqkpucrhadezti.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzY4MDYsImV4cCI6MjA3MjkxMjgwNn0.9AXkxH0cCNcvZltuBJmht4Uz36RWYfULzRhuSxJ3g0c';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzNjgwNiwiZXhwIjoyMDcyOTEyODA2fQ.rn8X9oAC_SMg07icJTB6Oom4BuW4VBZz7lKsE1LRpxQ';

// Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

console.log('Testing Supabase connection...');

async function testConnection() {
  try {
    // Test basic connection by fetching properties
    console.log('Fetching properties from Supabase...');
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Error fetching properties:', error);
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log(`Found ${data.length} properties`);
    
    if (data.length > 0) {
      console.log('Sample property:', data[0]);
    } else {
      console.log('No properties found in the database');
    }
    
    // Test fetching foreclosure listings
    console.log('Fetching foreclosure listings from Supabase...');
    
    const { data: foreclosureData, error: foreclosureError } = await supabase
      .from('foreclosure_listings')
      .select('*')
      .limit(5);
    
    if (foreclosureError) {
      console.error('Error fetching foreclosure listings:', foreclosureError);
      return;
    }
    
    console.log(`Found ${foreclosureData.length} foreclosure listings`);
    
    if (foreclosureData.length > 0) {
      console.log('Sample foreclosure listing:', foreclosureData[0]);
    } else {
      console.log('No foreclosure listings found in the database');
    }
    
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
  }
}

testConnection();