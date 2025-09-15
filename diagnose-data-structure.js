// diagnose-data-structure.js
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

async function diagnoseDataStructure() {
  console.log('Diagnosing data structure from Supabase...\n');
  
  try {
    // Check properties table structure
    console.log('=== PROPERTIES TABLE ===');
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('*')
      .limit(2);
    
    if (propError) {
      console.error('Error fetching properties:', propError);
    } else {
      console.log(`Found ${properties.length} properties`);
      if (properties.length > 0) {
        console.log('Sample property structure:');
        console.log(JSON.stringify(properties[0], null, 2));
      }
    }
    
    console.log('\n=== FORECLOSURE LISTINGS TABLE ===');
    const { data: foreclosures, error: foreError } = await supabase
      .from('foreclosure_listings')
      .select('*')
      .limit(2);
    
    if (foreError) {
      console.error('Error fetching foreclosure listings:', foreError);
    } else {
      console.log(`Found ${foreclosures.length} foreclosure listings`);
      if (foreclosures.length > 0) {
        console.log('Sample foreclosure listing structure:');
        console.log(JSON.stringify(foreclosures[0], null, 2));
      }
    }
    
    console.log('\n=== PARTNERS TABLE ===');
    const { data: partners, error: partnerError } = await supabase
      .from('partners')
      .select('*')
      .limit(2);
    
    if (partnerError) {
      console.error('Error fetching partners:', partnerError);
    } else {
      console.log(`Found ${partners.length} partners`);
      if (partners.length > 0) {
        console.log('Sample partner structure:');
        console.log(JSON.stringify(partners[0], null, 2));
      }
    }
    
    console.log('\n=== LEADS TABLE ===');
    const { data: leads, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .limit(2);
    
    if (leadError) {
      console.error('Error fetching leads:', leadError);
    } else {
      console.log(`Found ${leads.length} leads`);
      if (leads.length > 0) {
        console.log('Sample lead structure:');
        console.log(JSON.stringify(leads[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('Error in diagnosis:', error);
  }
}

diagnoseDataStructure();