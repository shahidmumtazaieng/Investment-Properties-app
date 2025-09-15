// Test to check if server imports correctly
console.log('Testing server imports...');

try {
  console.log('Importing express...');
  import('express').then(() => {
    console.log('Express imported successfully');
  }).catch(err => {
    console.error('Error importing express:', err);
  });
} catch (err) {
  console.error('Error with express import:', err);
}

try {
  console.log('Importing path...');
  import('path').then(() => {
    console.log('Path imported successfully');
  }).catch(err => {
    console.error('Error importing path:', err);
  });
} catch (err) {
  console.error('Error with path import:', err);
}

console.log('Test completed');