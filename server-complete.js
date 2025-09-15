// server-complete.js
// A complete server implementation with all routes and proper startup

import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { createServer } from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { SupabaseStorage } from './dist/supabase-storage.js';
import { randomBytes } from 'crypto';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const storage = new SupabaseStorage();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with PostgreSQL store
const PgSession = pgSession(session);

app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: "user_sessions"
  }),
  secret: process.env.SESSION_SECRET || "investor-properties-ny-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Utility functions for verification
function generateEmailVerificationToken() {
  return randomBytes(32).toString("hex");
}

function isVerificationValid(sentAt, type) {
  const now = new Date();
  const diffMs = now.getTime() - sentAt.getTime();
  const maxAgeMs = type === "email" ? 24 * 60 * 60 * 1000 : 10 * 60 * 1000;
  return diffMs <= maxAgeMs;
}

// Mock email sending function (in production, use a real email service)
async function sendEmailVerification(email, token, name) {
  console.log(`
📧 EMAIL VERIFICATION`);
  console.log(`To: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`Verification Link: http://localhost:3000/verify-email?token=${token}`);
  console.log(`
Subject: Verify Your Email - Investor Properties NY`);
  console.log(`
Hi ${name},

Welcome to Investor Properties NY! Please verify your email address by clicking the link below:

http://localhost:3000/verify-email?token=${token}

This link will expire in 24 hours.

Best regards,
Investor Properties NY Team`);
  return true;
}

// User authentication routes
app.post("/api/users/register", async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    
    // Check if username or email already exists
    const existingUsername = await storage.getUserByUsername(username);
    const existingEmail = await storage.getUserByEmail(email);
    
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    // Generate email verification token
    const emailToken = generateEmailVerificationToken();
    
    // Create user with verification token
    const userData = {
      username,
      password, // In production, hash this
      email,
      firstName,
      lastName,
      emailVerified: false,
      email_verification_token: emailToken,
      email_verification_sent_at: new Date()
    };
    
    const user = await storage.createUser(userData);
    
    // Send verification email
    try {
      await sendEmailVerification(email, emailToken, firstName);
    } catch (verificationError) {
      console.log("Verification email sending failed:", verificationError);
    }
    
    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for verification.",
      userId: user.id,
      requiresVerification: true
    });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/users/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await storage.getUserByEmailToken(token);
    
    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }
    
    if (!user.email_verification_sent_at || !isVerificationValid(user.email_verification_sent_at, "email")) {
      return res.status(400).json({ message: "Verification token expired" });
    }
    
    await storage.updateUser(user.id, {
      emailVerified: true,
      email_verified_at: new Date(),
      email_verification_token: null
    });
    
    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed" });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    
    const user = await storage.authenticateUser(username, password);
    
    if (user && user.emailVerified) {
      req.session.userId = user.id;
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          firstName: user.firstName, 
          lastName: user.lastName,
          email: user.email
        } 
      });
    } else if (user && !user.emailVerified) {
      res.status(401).json({ message: "Please verify your email before logging in" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/users/logout", async (req, res) => {
  req.session.userId = undefined;
  res.json({ success: true });
});

app.get("/api/users/me", async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const user = await storage.getUser(userId);
    if (user) {
      res.json({ 
        id: user.id, 
        username: user.username, 
        firstName: user.firstName, 
        lastName: user.lastName,
        email: user.email
      });
    } else {
      res.status(401).json({ message: "Invalid session" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to get user info" });
  }
});

// Get user profile with offers
app.get("/api/users/profile", async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    // Get the user
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get leads for this user
    const leads = await storage.getLeads();
    const userLeads = leads.filter(lead => 
      lead.email === user.email && lead.firstName === user.firstName && lead.lastName === user.lastName
    );
    
    // Get offers for these leads
    const allOffers = [];
    for (const lead of userLeads) {
      const offers = await storage.getOffersByProperty(lead.id);
      allOffers.push(...offers);
    }
    
    res.json({ 
      user: {
        id: user.id, 
        username: user.username, 
        firstName: user.firstName, 
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      },
      offers: allOffers
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user profile" });
  }
});

app.put("/api/users/profile", async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const { firstName, lastName, email, phone } = req.body;
    const updates = {};
    
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    
    const user = await storage.updateUser(userId, updates);
    
    if (user) {
      res.json({ 
        success: true,
        user: { 
          id: user.id, 
          username: user.username, 
          firstName: user.firstName, 
          lastName: user.lastName,
          email: user.email
        } 
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// User offer routes
app.post("/api/users/offers", async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const { propertyId, offerAmount, terms, financingType, downPayment, closingDate, contingencies, additionalTerms } = req.body;
    
    // First, get the user to create a lead
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Create a lead for this user
    const leadData = {
      type: "buyer",
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || "",
      source: "website_form",
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    const lead = await storage.createLead(leadData);
    
    // Create the offer
    const offerData = {
      propertyId,
      buyerLeadId: lead.id,
      offerAmount,
      terms: terms || "",
      financingType: financingType || "",
      downPayment: downPayment || null,
      closingDate: closingDate || "",
      contingencies: contingencies || "",
      additionalTerms: additionalTerms || "",
      status: "pending"
    };
    
    const offer = await storage.createOffer(offerData);
    
    // Create communication records
    await storage.createCommunication({
      leadId: lead.id,
      type: "email",
      direction: "outbound",
      subject: "Offer Submitted Successfully",
      content: `Your offer of $${offerAmount} has been submitted for review. We'll contact you within 24 hours with next steps.`,
      status: "sent",
      sentAt: new Date()
    });
    
    await storage.createCommunication({
      leadId: lead.id,
      type: "email",
      direction: "inbound",
      subject: "New Offer Received",
      content: `New offer received for property ${propertyId}. Amount: $${offerAmount}. Review required.`,
      status: "sent",
      sentAt: new Date()
    });
    
    res.status(201).json(offer);
  } catch (error) {
    console.error("Offer creation error:", error);
    res.status(400).json({ message: "Invalid offer data" });
  }
});

app.get("/api/users/offers", async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    // Get the user
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get leads for this user
    const leads = await storage.getLeads();
    const userLeads = leads.filter(lead => 
      lead.email === user.email && lead.firstName === user.firstName && lead.lastName === user.lastName
    );
    
    // Get offers for these leads
    const allOffers = [];
    for (const lead of userLeads) {
      const offers = await storage.getOffersByProperty(lead.id);
      allOffers.push(...offers);
    }
    
    res.json(allOffers);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user offers" });
  }
});

// API Routes
app.get('/api/properties', async (req, res) => {
  try {
    console.log('Fetching properties from Supabase...');
    const properties = await storage.getProperties();
    console.log(`Found ${properties.length} properties`);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await storage.getProperty(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Failed to fetch property' });
  }
});

app.get('/api/foreclosure-listings', async (req, res) => {
  try {
    const county = req.query.county;
    const listings = county ? await storage.getForeclosureListingsByCounty(county) : await storage.getForeclosureListings();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching foreclosure listings:', error);
    res.status(500).json({ message: 'Failed to fetch foreclosure listings' });
  }
});

app.get('/api/foreclosure-listings/:id', async (req, res) => {
  try {
    const listing = await storage.getForeclosureListing(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Foreclosure listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error fetching foreclosure listing:', error);
    res.status(500).json({ message: 'Failed to fetch foreclosure listing' });
  }
});

// Blog API Routes
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await storage.getPublishedBlogs();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await storage.getBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
});

app.get('/api/blogs/slug/:slug', async (req, res) => {
  try {
    const blog = await storage.getBlogBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
});

// Institutional Investor API Routes
app.post('/api/institutional-investors', async (req, res) => {
  try {
    const {
      personName,
      institutionName,
      jobTitle,
      workEmail,
      workPhone,
      personalPhone
    } = req.body;

    // Check if institutional investor with this email already exists
    const existingInstitutionalInvestor = await storage.getInstitutionalInvestorByEmail(workEmail);
    if (existingInstitutionalInvestor) {
      return res.status(400).json({ message: 'An application with this email already exists' });
    }

    // Create institutional investor application
    const institutionalInvestorData = {
      person_name: personName,
      institution_name: institutionName,
      job_title: jobTitle,
      email: workEmail,
      work_phone: workPhone,
      personal_phone: personalPhone,
      status: 'pending',
      is_active: false
    };

    const institutionalInvestor = await storage.createInstitutionalInvestor(institutionalInvestorData);

    // Also create a lead for tracking purposes
    const leadData = {
      type: 'institutional_investor',
      name: personName,
      email: workEmail,
      phone: workPhone,
      source: 'institutional_network_form',
      status: 'new'
    };

    const lead = await storage.createLead(leadData);

    // Send confirmation (in a real app, you would send an actual email)
    console.log(`
📧 INSTITUTIONAL INVESTOR APPLICATION RECEIVED
To: ${workEmail}
Subject: Institutional Investor Application Received - Investor Properties NY

Dear ${personName},

Thank you for your interest in joining our Institutional Investor Network. We have received your application and will review it within 48 hours.

Application Details:
- Institution: ${institutionName}
- Contact Person: ${personName}
- Job Title: ${jobTitle}
- Work Email: ${workEmail}
- Work Phone: ${workPhone}
- Personal Phone: ${personalPhone}

We will contact you once your application has been reviewed.

Best regards,
Investor Properties NY Team`);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. We will review your application within 48 hours.',
      institutionalInvestorId: institutionalInvestor.id
    });
  } catch (error) {
    console.error('Institutional investor application error:', error);
    res.status(500).json({ message: 'Failed to submit application' });
  }
});

// Institutional Investor Authentication Routes
app.post('/api/auth/institutional/register', async (req, res) => {
  try {
    const { 
      personName, 
      institutionName, 
      jobTitle, 
      email, 
      workPhone, 
      personalPhone 
    } = req.body;

    // Check if institutional investor with this email already exists
    const existingInstitutionalInvestor = await storage.getInstitutionalInvestorByEmail(email);
    if (existingInstitutionalInvestor) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Create institutional investor application
    const institutionalInvestorData = {
      person_name: personName,
      institution_name: institutionName,
      job_title: jobTitle,
      email: email,
      work_phone: workPhone,
      personal_phone: personalPhone
    };

    const institutionalInvestor = await storage.registerInstitutionalInvestor(institutionalInvestorData);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending approval.',
      institutionalInvestor: {
        id: institutionalInvestor.id,
        personName: institutionalInvestor.person_name,
        institutionName: institutionalInvestor.institution_name,
        email: institutionalInvestor.email
      }
    });
  } catch (error) {
    console.error('Institutional investor registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/institutional/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const institutionalInvestor = await storage.authenticateInstitutionalInvestor(email, password);

    if (institutionalInvestor) {
      // Check if the investor is approved
      if (institutionalInvestor.status !== 'approved') {
        return res.status(401).json({ message: 'Your account is pending approval' });
      }

      // Create session
      req.session.institutionalInvestorId = institutionalInvestor.id;
      
      res.json({
        success: true,
        institutionalInvestor: {
          id: institutionalInvestor.id,
          personName: institutionalInvestor.person_name,
          institutionName: institutionalInvestor.institution_name,
          email: institutionalInvestor.email,
          jobTitle: institutionalInvestor.job_title
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Institutional investor login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/institutional/logout', async (req, res) => {
  req.session.institutionalInvestorId = undefined;
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/institutional/me', async (req, res) => {
  const institutionalInvestorId = req.session?.institutionalInvestorId;
  if (!institutionalInvestorId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const institutionalInvestor = await storage.getInstitutionalInvestor(institutionalInvestorId);
    if (institutionalInvestor && institutionalInvestor.status === 'approved' && institutionalInvestor.isActive) {
      res.json({
        id: institutionalInvestor.id,
        personName: institutionalInvestor.person_name,
        institutionName: institutionalInvestor.institution_name,
        email: institutionalInvestor.email,
        jobTitle: institutionalInvestor.job_title
      });
    } else {
      res.status(401).json({ message: 'Invalid session' });
    }
  } catch (error) {
    console.error('Error fetching institutional investor info:', error);
    res.status(500).json({ message: 'Failed to get investor info' });
  }
});

// Leads API Routes
app.post('/api/leads', async (req, res) => {
  try {
    const validatedData = req.body;
    
    // Generate verification tokens for buyer leads
    let emailToken = null;
    let phoneCode = null;
    if (validatedData.type === "buyer") {
      emailToken = generateEmailVerificationToken();
      phoneCode = Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    const leadWithVerification = {
      ...validatedData,
      email_verification_token: emailToken,
      phone_verification_code: phoneCode,
      email_verification_sent_at: emailToken ? new Date() : null,
      phone_verification_sent_at: phoneCode ? new Date() : null
    };
    
    const lead = await storage.createLead(leadWithVerification);
    
    // Send verification emails for buyer leads
    if (lead.type === "buyer" && emailToken && phoneCode) {
      try {
        await sendEmailVerification(lead.email, emailToken, lead.name);
        console.log(`SMS verification would be sent to ${lead.phone} with code: ${phoneCode}`);
      } catch (verificationError) {
        console.log("Verification sending failed:", verificationError);
      }
    }
    
    // Remove sensitive verification data from response
    const { email_verification_token, phone_verification_code, ...publicLead } = lead;
    res.status(201).json(publicLead);
  } catch (error) {
    console.error("Lead creation error:", error);
    res.status(400).json({ message: "Invalid lead data" });
  }
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist/public')));

// Serve the admin dashboard at /control-panel routes (NEW ROUTES)
app.get('/control-panel', (req, res) => {
  console.log('Serving /control-panel route');
  const indexPath = path.join(__dirname, 'dist/public/index.html');
  console.log('Index path:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving /control-panel:', err);
      res.status(500).send('Error serving page');
    }
  });
});

app.get('/control-panel/login', (req, res) => {
  console.log('Serving /control-panel/login route');
  const indexPath = path.join(__dirname, 'dist/public/index.html');
  console.log('Index path:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving /control-panel/login:', err);
      res.status(500).send('Error serving page');
    }
  });
});

app.get('/control-panel/*', (req, res) => {
  console.log('Serving /control-panel/* route for:', req.params[0]);
  const indexPath = path.join(__dirname, 'dist/public/index.html');
  console.log('Index path:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving /control-panel/*:', err);
      res.status(500).send('Error serving page');
    }
  });
});

// Blog page route - modified to work with React router
app.get('/blog', (req, res) => {
  console.log('Serving /blog route');
  // Serve the main React app which will handle the blog routing
  res.sendFile(path.join(__dirname, 'dist/public', 'index.html'));
});

// Join buyers page route
app.get('/join-buyers', (req, res) => {
  console.log('Serving /join-buyers route');
  // Serve the main React app which will handle the join buyers routing
  res.sendFile(path.join(__dirname, 'dist/public', 'index.html'));
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  console.log('Serving fallback route for:', req.path);
  res.sendFile(path.join(__dirname, 'dist/public', 'index.html'));
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Authenticate admin user
    const adminUser = await storage.authenticateAdmin(username, password);
    
    if (adminUser) {
      // In a real implementation, you would generate a proper JWT token
      // For now, we'll just return the user data
      res.json({
        success: true,
        user: adminUser,
        token: 'admin-secret-token' // In production, use a real JWT token
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

// Admin authentication middleware
function isAdminAuthenticated(req, res, next) {
  // Check for admin token in session or header
  const token = req.headers.authorization;
  
  if (token && token.startsWith('Bearer ')) {
    const authToken = token.substring(7); // Remove 'Bearer ' prefix
    if (authToken === 'admin-secret-token') {
      return next();
    }
  }
  
  // If no valid token, check session
  if (req.session && req.session.isAdmin) {
    return next();
  }
  
  res.status(401).json({ message: 'Unauthorized: Admin access required' });
}

// Add missing admin logout endpoint
app.post('/api/admin/logout', (req, res) => {
  // Clear admin session
  if (req.session) {
    req.session.isAdmin = false;
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Add admin me endpoint
app.get('/api/admin/me', isAdminAuthenticated, async (req, res) => {
  res.json({ 
    success: true, 
    user: { 
      id: 'admin-1', 
      username: 'admin', 
      role: 'administrator' 
    } 
  });
});

// Add missing routes for full CRUD operations

// Properties management
app.get('/api/admin/properties', isAdminAuthenticated, async (req, res) => {
  try {
    const properties = await storage.getProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

app.post('/api/admin/properties', isAdminAuthenticated, async (req, res) => {
  try {
    const propertyData = req.body;
    const property = await storage.createProperty(propertyData);
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({ message: 'Invalid property data' });
  }
});

app.put('/api/admin/properties/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const property = await storage.updateProperty(id, updates);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Failed to update property' });
  }
});

app.delete('/api/admin/properties/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteProperty(id);
    if (!success) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Failed to delete property' });
  }
});

// Foreclosure listings management
app.get('/api/admin/foreclosure-listings', isAdminAuthenticated, async (req, res) => {
  try {
    const listings = await storage.getForeclosureListings();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching foreclosure listings:', error);
    res.status(500).json({ message: 'Failed to fetch foreclosure listings' });
  }
});

app.post('/api/admin/foreclosure-listings', isAdminAuthenticated, async (req, res) => {
  try {
    const listingData = req.body;
    const listing = await storage.createForeclosureListing(listingData);
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating foreclosure listing:', error);
    res.status(400).json({ message: 'Invalid foreclosure listing data' });
  }
});

app.put('/api/admin/foreclosure-listings/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const listing = await storage.updateForeclosureListing(id, updates);
    if (!listing) {
      return res.status(404).json({ message: 'Foreclosure listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error updating foreclosure listing:', error);
    res.status(500).json({ message: 'Failed to update foreclosure listing' });
  }
});

app.delete('/api/admin/foreclosure-listings/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteForeclosureListing(id);
    if (!success) {
      return res.status(404).json({ message: 'Foreclosure listing not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting foreclosure listing:', error);
    res.status(500).json({ message: 'Failed to delete foreclosure listing' });
  }
});

// Institutional investors management
app.get('/api/admin/institutional-investors', isAdminAuthenticated, async (req, res) => {
  try {
    const investors = await storage.getInstitutionalInvestors();
    res.json(investors);
  } catch (error) {
    console.error('Error fetching institutional investors:', error);
    res.status(500).json({ message: 'Failed to fetch institutional investors' });
  }
});

app.put('/api/admin/institutional-investors/:id/approve', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    const investor = await storage.approveInstitutionalInvestor(id, approvedBy);
    if (!investor) {
      return res.status(404).json({ message: 'Institutional investor not found' });
    }
    res.json(investor);
  } catch (error) {
    console.error('Error approving institutional investor:', error);
    res.status(500).json({ message: 'Failed to approve institutional investor' });
  }
});

app.put('/api/admin/institutional-investors/:id/reject', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const investor = await storage.updateInstitutionalInvestor(id, {
      status: 'rejected',
      rejection_reason: reason
    });
    if (!investor) {
      return res.status(404).json({ message: 'Institutional investor not found' });
    }
    res.json(investor);
  } catch (error) {
    console.error('Error rejecting institutional investor:', error);
    res.status(500).json({ message: 'Failed to reject institutional investor' });
  }
});

app.put('/api/admin/institutional-investors/:id/block', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const investor = await storage.updateInstitutionalInvestor(id, {
      is_active: false
    });
    if (!investor) {
      return res.status(404).json({ message: 'Institutional investor not found' });
    }
    res.json(investor);
  } catch (error) {
    console.error('Error blocking institutional investor:', error);
    res.status(500).json({ message: 'Failed to block institutional investor' });
  }
});

app.put('/api/admin/institutional-investors/:id/unblock', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const investor = await storage.updateInstitutionalInvestor(id, {
      is_active: true
    });
    if (!investor) {
      return res.status(404).json({ message: 'Institutional investor not found' });
    }
    res.json(investor);
  } catch (error) {
    console.error('Error unblocking institutional investor:', error);
    res.status(500).json({ message: 'Failed to unblock institutional investor' });
  }
});

// Partners management
app.get('/api/admin/partners', isAdminAuthenticated, async (req, res) => {
  try {
    const partners = await storage.getPartners();
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Failed to fetch partners' });
  }
});

app.put('/api/admin/partners/:id/approve', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    const partner = await storage.updatePartner(id, {
      approval_status: 'approved',
      approved_at: new Date(),
      approved_by: approvedBy
    });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    console.error('Error approving partner:', error);
    res.status(500).json({ message: 'Failed to approve partner' });
  }
});

app.put('/api/admin/partners/:id/reject', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const partner = await storage.updatePartner(id, {
      approval_status: 'rejected',
      rejection_reason: reason
    });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    console.error('Error rejecting partner:', error);
    res.status(500).json({ message: 'Failed to reject partner' });
  }
});

// Users management
app.get('/api/admin/users', isAdminAuthenticated, async (req, res) => {
  try {
    const users = await storage.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.put('/api/admin/users/:id/block', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await storage.updateUser(id, {
      is_active: false
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Failed to block user' });
  }
});

app.put('/api/admin/users/:id/unblock', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await storage.updateUser(id, {
      is_active: true
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Failed to unblock user' });
  }
});

// Dashboard statistics
app.get('/api/admin/stats', isAdminAuthenticated, async (req, res) => {
  try {
    const [
      properties,
      foreclosureListings,
      institutionalInvestors,
      partners,
      users,
      leads,
      offers,
      bids
    ] = await Promise.all([
      storage.getProperties(),
      storage.getForeclosureListings(),
      storage.getAllInstitutionalInvestors(),
      storage.getAllPartners(),
      storage.getAllUsers(),
      storage.getLeads(),
      storage.getAllOffers(),
      storage.getAllBids()
    ]);

    const stats = {
      properties: properties.length,
      foreclosureListings: foreclosureListings.length,
      institutionalInvestors: institutionalInvestors.length,
      partners: partners.length,
      users: users.length,
      leads: leads.length,
      offers: offers.length,
      bids: bids.bidServiceRequests.length + bids.institutionalBids.length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Leads management (full CRUD)
app.get('/api/admin/leads', isAdminAuthenticated, async (req, res) => {
  try {
    const type = req.query.type;
    const leads = type ? await storage.getLeadsByType(type) : await storage.getLeads();
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

app.post('/api/admin/leads', isAdminAuthenticated, async (req, res) => {
  try {
    const leadData = req.body;
    const lead = await storage.createLead(leadData);
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(400).json({ message: 'Invalid lead data' });
  }
});

app.put('/api/admin/leads/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const lead = await storage.updateLead(id, updates);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Failed to update lead' });
  }
});

app.delete('/api/admin/leads/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteLead(id);
    if (!success) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Failed to delete lead' });
  }
});

// Offers management (full CRUD)
app.get('/api/admin/offers', isAdminAuthenticated, async (req, res) => {
  try {
    const offers = await storage.getOffers();
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
});

app.post('/api/admin/offers', isAdminAuthenticated, async (req, res) => {
  try {
    const offerData = req.body;
    const offer = await storage.createOffer(offerData);
    res.status(201).json(offer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(400).json({ message: 'Invalid offer data' });
  }
});

app.put('/api/admin/offers/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const offer = await storage.updateOffer(id, updates);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ message: 'Failed to update offer' });
  }
});

app.delete('/api/admin/offers/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteOffer(id);
    if (!success) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ message: 'Failed to delete offer' });
  }
});

// Bids management
app.get('/api/admin/bids', isAdminAuthenticated, async (req, res) => {
  try {
    const bids = await storage.getBidServiceRequests();
    res.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: 'Failed to fetch bids' });
  }
});

// Communications management
app.get('/api/admin/communications', isAdminAuthenticated, async (req, res) => {
  try {
    const communications = await storage.getCommunications();
    res.json(communications);
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ message: 'Failed to fetch communications' });
  }
});

// Users management (full CRUD)
app.get('/api/admin/users', isAdminAuthenticated, async (req, res) => {
  try {
    const users = await storage.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.post('/api/admin/users', isAdminAuthenticated, async (req, res) => {
  try {
    const userData = req.body;
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await storage.createUser({ ...userData, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Invalid user data' });
  }
});

app.put('/api/admin/users/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    const user = await storage.updateUser(id, updates);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

app.delete('/api/admin/users/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteUser(id);
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Partners management (full CRUD)
app.get('/api/admin/partners', isAdminAuthenticated, async (req, res) => {
  try {
    const partners = await storage.getAllPartners();
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Failed to fetch partners' });
  }
});

app.post('/api/admin/partners', isAdminAuthenticated, async (req, res) => {
  try {
    const partnerData = req.body;
    const hashedPassword = await bcrypt.hash(partnerData.password, 12);
    const partner = await storage.createPartner({ ...partnerData, password: hashedPassword });
    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(400).json({ message: 'Invalid partner data' });
  }
});

app.put('/api/admin/partners/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    const partner = await storage.updatePartner(id, updates);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ message: 'Failed to update partner' });
  }
});

app.delete('/api/admin/partners/:id', isAdminAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deletePartner(id);
    if (!success) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ message: 'Failed to delete partner' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Start server with better error handling
const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || 'localhost';

const server = createServer(app);

server.listen(port, host, () => {
  console.log(`🚀 Server running on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});