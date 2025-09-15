// test-integration.js
import { SupabaseStorage } from './dist/supabase-storage.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing Supabase integration...');

async function testIntegration() {
  try {
    // Initialize the Supabase storage
    const storage = new SupabaseStorage();
    
    console.log('1. Testing property fetching...');
    
    // Test fetching properties
    const properties = await storage.getProperties();
    console.log(`✓ Successfully fetched ${properties.length} properties`);
    
    if (properties.length > 0) {
      console.log('  Sample property:', {
        id: properties[0].id,
        address: properties[0].address,
        price: properties[0].price
      });
    }
    
    console.log('2. Testing foreclosure listings...');
    
    // Test fetching foreclosure listings
    const foreclosureListings = await storage.getForeclosureListings();
    console.log(`✓ Successfully fetched ${foreclosureListings.length} foreclosure listings`);
    
    if (foreclosureListings.length > 0) {
      console.log('  Sample foreclosure listing:', {
        id: foreclosureListings[0].id,
        address: foreclosureListings[0].address,
        county: foreclosureListings[0].county
      });
    }
    
    console.log('3. Testing partners...');
    
    // Test fetching partners
    const partners = await storage.getPartners();
    console.log(`✓ Successfully fetched ${partners.length} partners`);
    
    if (partners.length > 0) {
      console.log('  Sample partner:', {
        id: partners[0].id,
        username: partners[0].username,
        email: partners[0].email
      });
    }
    
    console.log('4. Testing leads...');
    
    // Test fetching leads
    const leads = await storage.getLeads();
    console.log(`✓ Successfully fetched ${leads.length} leads`);
    
    if (leads.length > 0) {
      console.log('  Sample lead:', {
        id: leads[0].id,
        name: leads[0].name,
        email: leads[0].email,
        type: leads[0].type
      });
    }
    
    console.log('\n🎉 All integration tests passed!');
    console.log('\n📊 Summary:');
    console.log(`  - Properties: ${properties.length}`);
    console.log(`  - Foreclosure Listings: ${foreclosureListings.length}`);
    console.log(`  - Partners: ${partners.length}`);
    console.log(`  - Leads: ${leads.length}`);
    
    console.log('\n✅ Supabase integration is working correctly!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
}

testIntegration();