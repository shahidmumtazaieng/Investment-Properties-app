// test-data-fetch.js
import { SupabaseStorage } from './dist/supabase-storage.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    const storage = new SupabaseStorage();
    
    // Test fetching properties
    console.log('Fetching properties...');
    const properties = await storage.getProperties();
    console.log(`Found ${properties.length} properties`);
    console.log('Sample property:', properties[0]);
    
    // Test fetching foreclosure listings
    console.log('Fetching foreclosure listings...');
    const foreclosureListings = await storage.getForeclosureListings();
    console.log(`Found ${foreclosureListings.length} foreclosure listings`);
    console.log('Sample foreclosure listing:', foreclosureListings[0]);
    
    // Test fetching partners
    console.log('Fetching partners...');
    const partners = await storage.getPartners();
    console.log(`Found ${partners.length} partners`);
    console.log('Sample partner:', partners[0]);
    
    // Test fetching leads
    console.log('Fetching leads...');
    const leads = await storage.getLeads();
    console.log(`Found ${leads.length} leads`);
    console.log('Sample lead:', leads[0]);
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
  }
}

testSupabaseConnection();