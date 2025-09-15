// Test script to verify admin authentication
import fetch from 'node-fetch';

async function testAdminAuth() {
  console.log('Testing Admin Authentication...\n');
  
  // Test 1: Attempt to access admin endpoint without authentication
  console.log('1. Testing unauthorized access to admin endpoint');
  try {
    const response = await fetch('http://localhost:3000/api/admin/partners');
    console.log(`Status: ${response.status}`);
    if (response.status === 401) {
      console.log('✅ Correctly denied access to unauthorized user');
    } else {
      console.log('❌ Should have been denied access');
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  
  // Test 2: Attempt admin login with correct credentials
  console.log('\n2. Testing admin login');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      }),
    });
    
    console.log(`Login Status: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);
    
    if (loginResponse.ok && loginData.success) {
      console.log('✅ Admin login successful');
      
      // Test 3: Access admin endpoint with token
      console.log('\n3. Testing authorized access to admin endpoint');
      try {
        const authResponse = await fetch('http://localhost:3000/api/admin/partners', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`Authorized Access Status: ${authResponse.status}`);
        if (authResponse.ok) {
          console.log('✅ Correctly allowed access to authorized admin');
        } else {
          console.log('❌ Should have been allowed access');
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    } else {
      console.log('❌ Admin login failed');
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  
  console.log('\nAdmin authentication testing completed!');
}

// Run the test
testAdminAuth();