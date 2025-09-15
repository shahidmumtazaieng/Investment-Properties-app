// Test script for the authentication system
import fetch from 'node-fetch';

async function testAuthSystem() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing Authentication System...\n');
  
  // Test 1: Register a new user
  console.log('1. Testing user registration');
  try {
    const registerResponse = await fetch(`${baseUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpassword123',
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User'
      })
    });
    
    console.log(`Registration status: ${registerResponse.status}`);
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    
    if (registerResponse.ok) {
      console.log('✅ User registration successful\n');
    } else {
      console.log('❌ User registration failed\n');
      return;
    }
  } catch (error) {
    console.error('Error during registration:', error.message);
    return;
  }
  
  // Test 2: Login with the new user
  console.log('2. Testing user login');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpassword123'
      })
    });
    
    console.log(`Login status: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginResponse.ok) {
      console.log('✅ User login successful\n');
    } else {
      console.log('❌ User login failed\n');
    }
  } catch (error) {
    console.error('Error during login:', error.message);
  }
  
  // Test 3: Access protected route without authentication
  console.log('3. Testing protected route access without authentication');
  try {
    const profileResponse = await fetch(`${baseUrl}/api/users/profile`);
    
    console.log(`Profile access status: ${profileResponse.status}`);
    
    if (profileResponse.status === 401) {
      console.log('✅ Correctly denied access to protected route\n');
    } else {
      console.log('❌ Incorrectly allowed access to protected route\n');
    }
  } catch (error) {
    console.error('Error accessing protected route:', error.message);
  }
  
  console.log('Authentication system test completed!');
}

// Run the test
testAuthSystem();