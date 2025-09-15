// Test script to verify frontend integration with backend APIs
import fetch from 'node-fetch';

async function testAPIEndpoints() {
  console.log('Testing API endpoints...\n');
  
  // Test 1: Properties API
  console.log('1. Testing Properties API');
  try {
    const propertiesResponse = await fetch('http://localhost:3000/api/properties');
    console.log(`Properties API status: ${propertiesResponse.status}`);
    
    if (propertiesResponse.ok) {
      const properties = await propertiesResponse.json();
      console.log(`✅ Properties API working - Found ${properties.length} properties`);
    } else {
      console.log('❌ Properties API failed');
    }
  } catch (error) {
    console.log(`❌ Properties API error: ${error.message}`);
  }
  
  // Test 2: Foreclosure Listings API
  console.log('\n2. Testing Foreclosure Listings API');
  try {
    const foreclosureResponse = await fetch('http://localhost:3000/api/foreclosure-listings');
    console.log(`Foreclosure Listings API status: ${foreclosureResponse.status}`);
    
    if (foreclosureResponse.ok) {
      const listings = await foreclosureResponse.json();
      console.log(`✅ Foreclosure Listings API working - Found ${listings.length} listings`);
    } else {
      console.log('❌ Foreclosure Listings API failed');
    }
  } catch (error) {
    console.log(`❌ Foreclosure Listings API error: ${error.message}`);
  }
  
  // Test 3: Blogs API
  console.log('\n3. Testing Blogs API');
  try {
    const blogsResponse = await fetch('http://localhost:3000/api/blogs');
    console.log(`Blogs API status: ${blogsResponse.status}`);
    
    if (blogsResponse.ok) {
      const blogs = await blogsResponse.json();
      console.log(`✅ Blogs API working - Found ${blogs.length} blog posts`);
    } else {
      console.log('❌ Blogs API failed');
    }
  } catch (error) {
    console.log(`❌ Blogs API error: ${error.message}`);
  }
  
  console.log('\nAPI testing completed!');
}

// Run the test
testAPIEndpoints();