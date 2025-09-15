// test-server-supabase.js
import express from 'express';
import { SupabaseStorage } from './dist/supabase-storage.js';

const app = express();
const storage = new SupabaseStorage();

// Middleware
app.use(express.json());

// Test endpoint
app.get('/test', async (req, res) => {
  try {
    // Test fetching properties
    const properties = await storage.getProperties();
    
    // Test fetching foreclosure listings
    const foreclosureListings = await storage.getForeclosureListings();
    
    res.json({
      success: true,
      message: 'Supabase integration test successful',
      propertiesCount: properties.length,
      foreclosureListingsCount: foreclosureListings.length,
      sampleProperty: properties[0] || null,
      sampleForeclosureListing: foreclosureListings[0] || null
    });
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});

// Start server
const port = 3001;
app.listen(port, () => {
  console.log(`Supabase test server running on http://localhost:${port}`);
  console.log('Visit http://localhost:3001/test to test the integration');
});