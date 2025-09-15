// Test script to verify new admin routing
const http = require('http');

console.log('Testing new admin routing...');

// Test 1: Check if /control-panel/login serves HTML content
const test1 = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/control-panel/login', (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const isHtml = data.includes('<!DOCTYPE html>') || data.includes('<html');
        console.log('Test 1 - /control-panel/login serves HTML:', isHtml ? 'PASS' : 'FAIL');
        if (!isHtml) {
          console.log('Response:', data.substring(0, 100) + '...');
        }
        resolve(isHtml);
      });
    });
    req.on('error', (err) => {
      console.log('Test 1 - /control-panel/login:', 'FAIL -', err.message);
      resolve(false);
    });
    req.setTimeout(5000, () => {
      console.log('Test 1 - /control-panel/login:', 'FAIL - Timeout');
      req.destroy();
      resolve(false);
    });
  });
};

// Test 2: Check if /api/admin/login serves JSON content
const test2 = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/admin/login', (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const isJson = data.includes('{') && data.includes('"');
        console.log('Test 2 - /api/admin/login serves JSON:', isJson ? 'PASS' : 'FAIL');
        if (!isJson) {
          console.log('Response:', data.substring(0, 100) + '...');
        }
        resolve(isJson);
      });
    });
    req.on('error', (err) => {
      console.log('Test 2 - /api/admin/login:', 'FAIL -', err.message);
      resolve(false);
    });
    req.setTimeout(5000, () => {
      console.log('Test 2 - /api/admin/login:', 'FAIL - Timeout');
      req.destroy();
      resolve(false);
    });
  });
};

// Test 3: Check if /api/admin/partners serves JSON content
const test3 = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/admin/partners', (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const isJson = data.includes('{') || data.includes('[');
        console.log('Test 3 - /api/admin/partners serves JSON:', isJson ? 'PASS' : 'FAIL');
        if (!isJson) {
          console.log('Response:', data.substring(0, 100) + '...');
        }
        resolve(isJson);
      });
    });
    req.on('error', (err) => {
      console.log('Test 3 - /api/admin/partners:', 'FAIL -', err.message);
      resolve(false);
    });
    req.setTimeout(5000, () => {
      console.log('Test 3 - /api/admin/partners:', 'FAIL - Timeout');
      req.destroy();
      resolve(false);
    });
  });
};

// Test 4: Check if /control-panel serves HTML content
const test4 = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/control-panel', (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const isHtml = data.includes('<!DOCTYPE html>') || data.includes('<html');
        console.log('Test 4 - /control-panel serves HTML:', isHtml ? 'PASS' : 'FAIL');
        if (!isHtml) {
          console.log('Response:', data.substring(0, 100) + '...');
        }
        resolve(isHtml);
      });
    });
    req.on('error', (err) => {
      console.log('Test 4 - /control-panel:', 'FAIL -', err.message);
      resolve(false);
    });
    req.setTimeout(5000, () => {
      console.log('Test 4 - /control-panel:', 'FAIL - Timeout');
      req.destroy();
      resolve(false);
    });
  });
};

// Run all tests
const runTests = async () => {
  console.log('Running new admin routing tests...\n');
  
  try {
    const result1 = await test1();
    const result2 = await test2();
    const result3 = await test3();
    const result4 = await test4();
    
    console.log('\n--- Test Results ---');
    console.log('Test 1 (/control-panel/login serves HTML):', result1 ? 'PASS' : 'FAIL');
    console.log('Test 2 (/api/admin/login serves JSON):', result2 ? 'PASS' : 'FAIL');
    console.log('Test 3 (/api/admin/partners serves JSON):', result3 ? 'PASS' : 'FAIL');
    console.log('Test 4 (/control-panel serves HTML):', result4 ? 'PASS' : 'FAIL');
    
    if (result1 && result2 && result3 && result4) {
      console.log('\n🎉 All tests passed! New admin routing is working correctly.');
      console.log('\nYou can now access the admin panel at:');
      console.log('- Login page: http://localhost:3000/control-panel/login');
      console.log('- Admin dashboard: http://localhost:3000/control-panel (after login)');
    } else {
      console.log('\n❌ Some tests failed. Check the routing configuration.');
    }
  } catch (error) {
    console.error('Error running tests:', error);
  }
};

// Run the tests
runTests();