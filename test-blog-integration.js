// Test script to verify blog integration with real database
import fetch from 'node-fetch';

async function testBlogIntegration() {
  try {
    console.log('Testing blog integration with real database...\n');
    
    // Test 1: Get all published blogs
    console.log('1. Testing GET /api/blogs');
    const blogsResponse = await fetch('http://localhost:3000/api/blogs');
    const blogsData = await blogsResponse.json();
    
    console.log(`Status: ${blogsResponse.status}`);
    console.log(`Found ${blogsData.length} published blog posts`);
    
    if (blogsData.length > 0) {
      console.log('First blog post:');
      console.log(`- Title: ${blogsData[0].title}`);
      console.log(`- Author: ${blogsData[0].author}`);
      console.log(`- Published: ${blogsData[0].publishedAt || blogsData[0].createdAt}`);
    }
    
    // Test 2: Get a specific blog by ID
    console.log('\n2. Testing GET /api/blogs/:id');
    if (blogsData.length > 0) {
      const blogId = blogsData[0].id;
      const blogResponse = await fetch(`http://localhost:3000/api/blogs/${blogId}`);
      const blogData = await blogResponse.json();
      
      console.log(`Status: ${blogResponse.status}`);
      console.log(`Blog title: ${blogData.title}`);
      console.log(`Blog author: ${blogData.author}`);
    }
    
    // Test 3: Get a specific blog by slug
    console.log('\n3. Testing GET /api/blogs/slug/:slug');
    if (blogsData.length > 0) {
      const slug = blogsData[0].slug;
      const slugResponse = await fetch(`http://localhost:3000/api/blogs/slug/${slug}`);
      const slugData = await slugResponse.json();
      
      console.log(`Status: ${slugResponse.status}`);
      console.log(`Blog title: ${slugData.title}`);
      console.log(`Blog excerpt: ${slugData.excerpt.substring(0, 100)}...`);
    }
    
    console.log('\n✅ Blog integration test completed successfully!');
    console.log('Your blog page should now be able to fetch real data from the database.');
    
  } catch (error) {
    console.error('❌ Error testing blog integration:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your server is running (node server-supabase.js)');
    console.log('2. Verify the blogs table was created in your Supabase database');
    console.log('3. Check that sample data was inserted correctly');
    console.log('4. Ensure your Supabase credentials are correct in the .env file');
  }
}

// Run the test
testBlogIntegration();