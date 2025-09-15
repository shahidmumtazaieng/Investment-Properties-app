// Script to verify blog setup
console.log('Verifying blog setup...');

// Check if required files exist
const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'dist/public/blog.html',
  'server-supabase.js',
  'dist/supabase-storage.js'
];

console.log('\n1. Checking required files:');
filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Not found`);
  }
});

// Check if blog routes are in server-supabase.js
const serverFile = path.join(__dirname, 'server-supabase.js');
if (fs.existsSync(serverFile)) {
  const serverContent = fs.readFileSync(serverFile, 'utf8');
  console.log('\n2. Checking blog routes in server-supabase.js:');
  
  const blogRoutes = [
    "/api/blogs",
    "/api/blogs/:id",
    "/api/blogs/slug/:slug",
    "/blog"
  ];
  
  blogRoutes.forEach(route => {
    if (serverContent.includes(route)) {
      console.log(`✅ Route ${route} - Found`);
    } else {
      console.log(`❌ Route ${route} - Not found`);
    }
  });
}

// Check if blog methods are in supabase-storage.js
const storageFile = path.join(__dirname, 'dist/supabase-storage.js');
if (fs.existsSync(storageFile)) {
  const storageContent = fs.readFileSync(storageFile, 'utf8');
  console.log('\n3. Checking blog methods in supabase-storage.js:');
  
  const blogMethods = [
    "getBlogs",
    "getPublishedBlogs",
    "getBlog",
    "getBlogBySlug",
    "createBlog",
    "updateBlog",
    "deleteBlog"
  ];
  
  blogMethods.forEach(method => {
    if (storageContent.includes(method)) {
      console.log(`✅ Method ${method} - Found`);
    } else {
      console.log(`❌ Method ${method} - Not found`);
    }
  });
}

console.log('\n✅ Blog setup verification complete!');
console.log('\nTo test the blog page:');
console.log('1. Make sure your Supabase database has the blogs table with sample data');
console.log('2. Start the server: npm run start:supabase');
console.log('3. Visit http://localhost:3000/blog in your browser');