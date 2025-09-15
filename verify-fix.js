// verify-fix.js
import { SupabaseStorage } from './dist/supabase-storage.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function verifyFix() {
  console.log('Verifying Supabase data structure fix...');
  
  try {
    const storage = new SupabaseStorage();
    
    // Test fetching properties
    console.log('\n=== Testing Properties ===');
    const properties = await storage.getProperties();
    console.log(`Found ${properties.length} properties`);
    
    if (properties.length > 0) {
      const property = properties[0];
      console.log('Sample property keys (should be camelCase):');
      console.log(Object.keys(property));
      
      // Check for expected camelCase keys
      const expectedKeys = ['id', 'address', 'neighborhood', 'borough', 'propertyType', 'price', 'description'];
      expectedKeys.forEach(key => {
        if (property.hasOwnProperty(key)) {
          console.log(`✓ Found expected key: ${key}`);
        } else {
          console.log(`✗ Missing expected key: ${key}`);
        }
      });
    }
    
    // Test fetching foreclosure listings
    console.log('\n=== Testing Foreclosure Listings ===');
    const foreclosureListings = await storage.getForeclosureListings();
    console.log(`Found ${foreclosureListings.length} foreclosure listings`);
    
    if (foreclosureListings.length > 0) {
      const listing = foreclosureListings[0];
      console.log('Sample foreclosure listing keys (should be camelCase):');
      console.log(Object.keys(listing));
      
      // Check for expected camelCase keys
      const expectedKeys = ['id', 'address', 'county', 'auctionDate', 'startingBid', 'propertyType'];
      expectedKeys.forEach(key => {
        if (listing.hasOwnProperty(key)) {
          console.log(`✓ Found expected key: ${key}`);
        } else {
          console.log(`✗ Missing expected key: ${key}`);
        }
      });
    }
    
    console.log('\n=== Verification Complete ===');
    console.log('If all keys are camelCase and expected keys are present, the fix is working!');
    
  } catch (error) {
    console.error('Error during verification:', error);
  }
}

verifyFix();