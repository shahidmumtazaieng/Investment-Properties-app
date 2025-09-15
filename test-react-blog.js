// Test script to verify the React blog component can fetch data from the API
import fetch from 'node-fetch';

async function testReactBlog() {
  try {
    console.log('Testing React blog API integration...\n');
    
    // Test 1: Check if the blog API is working
    console.log('1. Testing blog API endpoints');
    const blogsResponse = await fetch('http://localhost:3000/api/blogs');
    console.log(`API blogs endpoint status: ${blogsResponse.status}`);
    
    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json();
      console.log(`Found ${blogsData.length} blog posts`);
      
      if (blogsData.length > 0) {
        console.log('First blog post:');
        console.log(`- Title: ${blogsData[0].title}`);
        console.log(`- Author: ${blogsData[0].author}`);
        console.log(`- Published: ${blogsData[0].published}`);
        
        // Test 2: Get a specific blog by ID
        console.log('\n2. Testing specific blog post retrieval');
        const blogId = blogsData[0].id;
        const blogResponse = await fetch(`http://localhost:3000/api/blogs/${blogId}`);
        console.log(`Specific blog status: ${blogResponse.status}`);
        
        if (blogResponse.ok) {
          const blogData = await blogResponse.json();
          console.log(`Retrieved blog: ${blogData.title}`);
        }
      }
    }
    
    console.log('\n✅ React blog API testing completed!');
    console.log('The React blog component should now be able to fetch data from these endpoints.');
    
  } catch (error) {
    console.error('❌ Error testing React blog API:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your server is running (npm run start:supabase)');
    console.log('2. Verify the blogs table was created in your Supabase database');
    console.log('3. Check that sample data was inserted correctly');
    console.log('4. Ensure your Supabase credentials are correct in the .env file');
  }
}

// Run the test
testReactBlog();