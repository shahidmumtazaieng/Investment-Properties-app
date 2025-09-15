// Test script for blog functionality
import { SupabaseStorage } from './dist/supabase-storage.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testBlogFunctionality() {
  const storage = new SupabaseStorage();
  
  try {
    console.log('Testing blog functionality...');
    
    // Test getting all published blogs
    console.log('\n1. Getting all published blogs:');
    const blogs = await storage.getPublishedBlogs();
    console.log(`Found ${blogs.length} published blogs`);
    console.log('First blog:', blogs[0]?.title || 'No blogs found');
    
    // Test getting a specific blog by slug
    console.log('\n2. Getting blog by slug:');
    if (blogs.length > 0) {
      const slug = blogs[0].slug;
      const blogBySlug = await storage.getBlogBySlug(slug);
      console.log(`Blog with slug "${slug}":`, blogBySlug?.title || 'Not found');
    }
    
    // Test getting a specific blog by ID
    console.log('\n3. Getting blog by ID:');
    if (blogs.length > 0) {
      const id = blogs[0].id;
      const blogById = await storage.getBlog(id);
      console.log(`Blog with ID "${id}":`, blogById?.title || 'Not found');
    }
    
    console.log('\nBlog functionality test completed successfully!');
  } catch (error) {
    console.error('Error testing blog functionality:', error.message);
  }
}

// Run the test
testBlogFunctionality();