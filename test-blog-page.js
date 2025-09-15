// Test script to verify the blog page is working correctly
import fetch from 'node-fetch';

async function testBlogPage() {
  try {
    console.log('Testing blog page functionality...\n');
    
    // Test 1: Check if the blog page is accessible
    console.log('1. Testing if blog page is accessible');
    const blogPageResponse = await fetch('http://localhost:3000/blog');
    console.log(`Blog page status: ${blogPageResponse.status}`);
    console.log(`Blog page content type: ${blogPageResponse.headers.get('content-type')}`);
    
    // Test 2: Check if the blog API is working
    console.log('\n2. Testing blog API endpoints');
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
        
        // Test 3: Get a specific blog by ID
        console.log('\n3. Testing specific blog post retrieval');
        const blogId = blogsData[0].id;
        const blogResponse = await fetch(`http://localhost:3000/api/blogs/${blogId}`);
        console.log(`Specific blog status: ${blogResponse.status}`);
        
        if (blogResponse.ok) {
          const blogData = await blogResponse.json();
          console.log(`Retrieved blog: ${blogData.title}`);
        }
      }
    }
    
    console.log('\n✅ Blog page testing completed!');
    console.log('You can now visit http://localhost:3000/blog to see the blog page with real data from the database.');
    
  } catch (error) {
    console.error('❌ Error testing blog page:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your server is running (node server-supabase.js)');
    console.log('2. Verify the blogs table was created in your Supabase database');
    console.log('3. Check that sample data was inserted correctly');
    console.log('4. Ensure your Supabase credentials are correct in the .env file');
  }
}

// Run the test
testBlogPage();