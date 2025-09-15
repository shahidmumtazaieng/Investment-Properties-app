// server/supabase-storage.ts
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

// Utility function to convert snake_case to camelCase
function snakeToCamel(str) {
  return str.replace(/(_\w)/g, (m) => m[1].toUpperCase());
}

// Utility function to convert object keys from snake_case to camelCase
function convertKeysToCamelCase(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }
  
  const converted = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = snakeToCamel(key);
      converted[camelKey] = convertKeysToCamelCase(obj[key]);
    }
  }
  return converted;
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://mxjjjoyqkpucrhadezti.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzY4MDYsImV4cCI6MjA3MjkxMjgwNn0.9AXkxH0cCNcvZltuBJmht4Uz36RWYfULzRhuSxJ3g0c';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ampqb3lxa3B1Y3JoYWRlenRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzNjgwNiwiZXhwIjoyMDcyOTEyODA2fQ.rn8X9oAC_SMg07icJTB6Oom4BuW4VBZz7lKsE1LRpxQ';

// Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export class SupabaseStorage {
  constructor() {
    // No initialization needed for Supabase
  }

  // User methods
  async getUser(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getUserByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async createUser(insertUser) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ ...insertUser, id: randomUUID() }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
    
    return convertKeysToCamelCase(data);
  }

  // Add getUserByEmail method
  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  // Add getUserByEmailToken method
  async getUserByEmailToken(token) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email_verification_token', token)
      .single();
    
    if (error) {
      console.error('Error fetching user by email token:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  // Add updateUser method
  async updateUser(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  // Add authenticateUser method
  async authenticateUser(username, password) {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async authenticateAdmin(username, password) {
    // First check hardcoded admin credentials for demo purposes
    if (username === 'admin' && password === 'admin123') {
      return { 
        id: 'admin-demo', 
        username: 'admin', 
        role: 'administrator',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User'
      };
    }
    
    // Then check in the users table for admin users
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        console.error('Error fetching admin user:', error);
        return null;
      }
      
      // Check if user exists, has admin role, and password matches
      if (data && data.role === 'admin' && await bcrypt.compare(password, data.password)) {
        return {
          id: data.id,
          username: data.username,
          role: 'administrator',
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name
        };
      }
    } catch (err) {
      console.error('Error authenticating admin user:', err);
    }
    
    return null;
  }

  // Partner methods
  async getPartners() {
    const { data, error } = await supabase
      .from('partners')
      .select('*');
    
    if (error) {
      console.error('Error fetching partners:', error);
      throw new Error('Failed to fetch partners');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getPartner(id) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching partner:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getPartnerByUsername(username) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching partner by username:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getPartnerByEmail(email) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching partner by email:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getPartnerByEmailToken(token) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('email_verification_token', token)
      .single();
    
    if (error) {
      console.error('Error fetching partner by email token:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async createPartner(insertPartner) {
    const now = new Date();
    const partnerData = {
      ...insertPartner,
      company: insertPartner.company || null,
      phone: insertPartner.phone || null,
      is_active: insertPartner.isActive ?? true,
      approval_status: insertPartner.approvalStatus || "pending",
      approved_at: insertPartner.approvedAt || null,
      approved_by: insertPartner.approvedBy || null,
      rejection_reason: insertPartner.rejectionReason || null,
      email_verified: insertPartner.emailVerified ?? false,
      email_verification_token: insertPartner.emailVerificationToken || null,
      email_verification_sent_at: insertPartner.emailVerificationSentAt || null,
      email_verified_at: insertPartner.emailVerifiedAt || null,
      phone_verified: insertPartner.phoneVerified ?? false,
      phone_verification_code: insertPartner.phoneVerificationCode || null,
      phone_verification_sent_at: insertPartner.phoneVerificationSentAt || null,
      phone_verified_at: insertPartner.phoneVerifiedAt || null,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('partners')
      .insert([partnerData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating partner:', error);
      throw new Error('Failed to create partner');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updatePartner(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('partners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating partner:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async authenticatePartner(username, password) {
    const partner = await this.getPartnerByUsername(username);
    if (partner && partner.password === password && partner.is_active && partner.email_verified && partner.phone_verified && partner.approval_status === "approved") {
      return partner;
    }
    return null;
  }

  // Property methods
  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching properties:', error);
      throw new Error('Failed to fetch properties');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getProperty(id) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching property:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async createProperty(insertProperty) {
    const now = new Date();
    const propertyData = {
      beds: null,
      baths: null,
      sqft: null,
      units: null,
      arv: null,
      estimated_profit: null,
      annual_income: null,
      cap_rate: null,
      condition: null,
      access: "Available with Appointment",
      images: null,
      description: null,
      google_sheets_row_id: null,
      partner_id: null,
      source: "internal",
      status: "available",
      is_active: true,
      ...insertProperty,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating property:', error);
      throw new Error('Failed to create property');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updateProperty(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating property:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async deleteProperty(id) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting property:', error);
      return false;
    }
    
    return true;
  }

  // Lead methods
  async getLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*');
    
    if (error) {
      console.error('Error fetching leads:', error);
      throw new Error('Failed to fetch leads');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getLead(id) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching lead:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getLeadsByType(type) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('type', type);
    
    if (error) {
      console.error('Error fetching leads by type:', error);
      throw new Error('Failed to fetch leads by type');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getLeadByEmailToken(token) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('email_verification_token', token)
      .single();
    
    if (error) {
      console.error('Error fetching lead by email token:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async createLead(insertLead) {
    const now = new Date();
    const leadData = {
      motivation: null,
      timeline: null,
      budget: null,
      preferred_areas: null,
      experience_level: null,
      property_details: null,
      notes: null,
      status: "new",
      email_verified: false,
      phone_verified: false,
      email_verification_token: null,
      phone_verification_code: null,
      email_verification_sent_at: null,
      phone_verification_sent_at: null,
      email_verified_at: null,
      phone_verified_at: null,
      ...insertLead,
      created_at: now,
      updated_at: now
    };

    // Ensure all property names are in snake_case to match the database schema
    const sanitizedLeadData = {
      type: leadData.type,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      source: leadData.source,
      status: leadData.status,
      motivation: leadData.motivation,
      timeline: leadData.timeline,
      budget: leadData.budget,
      preferred_areas: leadData.preferred_areas,
      experience_level: leadData.experience_level,
      property_details: leadData.property_details,
      notes: leadData.notes,
      email_verified: leadData.email_verified,
      phone_verified: leadData.phone_verified,
      email_verification_token: leadData.email_verification_token,
      phone_verification_code: leadData.phone_verification_code,
      email_verification_sent_at: leadData.email_verification_sent_at,
      phone_verification_sent_at: leadData.phone_verification_sent_at,
      email_verified_at: leadData.email_verified_at,
      phone_verified_at: leadData.phone_verified_at,
      created_at: leadData.created_at,
      updated_at: leadData.updated_at
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([sanitizedLeadData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead:', error);
      throw new Error('Failed to create lead');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updateLead(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating lead:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  // Offer methods
  async getOffers() {
    const { data, error } = await supabase
      .from('offers')
      .select('*');
    
    if (error) {
      console.error('Error fetching offers:', error);
      throw new Error('Failed to fetch offers');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getOffer(id) {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching offer:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getOffersByProperty(propertyId) {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('property_id', propertyId);
    
    if (error) {
      console.error('Error fetching offers by property:', error);
      throw new Error('Failed to fetch offers by property');
    }
    
    return convertKeysToCamelCase(data);
  }

  async createOffer(insertOffer) {
    const now = new Date();
    const offerData = {
      terms: null,
      offer_letter_url: null,
      proof_of_funds_url: null,
      closing_date: null,
      down_payment: null,
      financing_type: null,
      contingencies: null,
      additional_terms: null,
      signed_at: null,
      status: "pending",
      ...insertOffer,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('offers')
      .insert([offerData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating offer:', error);
      throw new Error('Failed to create offer');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updateOffer(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating offer:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  // Communication methods
  async getCommunications() {
    const { data, error } = await supabase
      .from('communications')
      .select('*');
    
    if (error) {
      console.error('Error fetching communications:', error);
      throw new Error('Failed to fetch communications');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getCommunicationsByLead(leadId) {
    const { data, error } = await supabase
      .from('communications')
      .select('*')
      .eq('lead_id', leadId);
    
    if (error) {
      console.error('Error fetching communications by lead:', error);
      throw new Error('Failed to fetch communications by lead');
    }
    
    return convertKeysToCamelCase(data);
  }

  async createCommunication(insertCommunication) {
    const communicationData = {
      subject: null,
      content: null,
      scheduled_for: null,
      sent_at: null,
      status: "sent",
      ...insertCommunication,
      created_at: new Date()
    };

    const { data, error } = await supabase
      .from('communications')
      .insert([communicationData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating communication:', error);
      throw new Error('Failed to create communication');
    }
    
    return convertKeysToCamelCase(data);
  }

  // Foreclosure listing methods
  async getForeclosureListings() {
    const { data, error } = await supabase
      .from('foreclosure_listings')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching foreclosure listings:', error);
      throw new Error('Failed to fetch foreclosure listings');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getForeclosureListing(id) {
    const { data, error } = await supabase
      .from('foreclosure_listings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching foreclosure listing:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getForeclosureListingsByCounty(county) {
    const { data, error } = await supabase
      .from('foreclosure_listings')
      .select('*')
      .eq('county', county)
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching foreclosure listings by county:', error);
      throw new Error('Failed to fetch foreclosure listings by county');
    }
    
    return convertKeysToCamelCase(data);
  }

  async createForeclosureListing(insertListing) {
    const now = new Date();
    const listingData = {
      property_type: null,
      beds: null,
      baths: null,
      sqft: null,
      year_built: null,
      description: null,
      docket_number: null,
      plaintiff: null,
      starting_bid: null,
      assessed_value: null,
      status: "upcoming",
      is_active: true,
      ...insertListing,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('foreclosure_listings')
      .insert([listingData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating foreclosure listing:', error);
      throw new Error('Failed to create foreclosure listing');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updateForeclosureListing(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('foreclosure_listings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating foreclosure listing:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  // Foreclosure subscription methods
  async getForeclosureSubscriptions() {
    const { data, error } = await supabase
      .from('foreclosure_subscriptions')
      .select('*');
    
    if (error) {
      console.error('Error fetching foreclosure subscriptions:', error);
      throw new Error('Failed to fetch foreclosure subscriptions');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getForeclosureSubscription(id) {
    const { data, error } = await supabase
      .from('foreclosure_subscriptions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching foreclosure subscription:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getForeclosureSubscriptionsByLead(leadId) {
    const { data, error } = await supabase
      .from('foreclosure_subscriptions')
      .select('*')
      .eq('lead_id', leadId);
    
    if (error) {
      console.error('Error fetching foreclosure subscriptions by lead:', error);
      throw new Error('Failed to fetch foreclosure subscriptions by lead');
    }
    
    return convertKeysToCamelCase(data);
  }

  async createForeclosureSubscription(insertSubscription) {
    const now = new Date();
    const subscriptionData = {
      is_active: true,
      last_sent: null,
      ...insertSubscription,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('foreclosure_subscriptions')
      .insert([subscriptionData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating foreclosure subscription:', error);
      throw new Error('Failed to create foreclosure subscription');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updateForeclosureSubscription(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('foreclosure_subscriptions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating foreclosure subscription:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  // Bid service request methods
  async getBidServiceRequests() {
    const { data, error } = await supabase
      .from('bid_service_requests')
      .select('*');
    
    if (error) {
      console.error('Error fetching bid service requests:', error);
      throw new Error('Failed to fetch bid service requests');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getBidServiceRequest(id) {
    const { data, error } = await supabase
      .from('bid_service_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching bid service request:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getBidServiceRequestsByLead(leadId) {
    const { data, error } = await supabase
      .from('bid_service_requests')
      .select('*')
      .eq('lead_id', leadId);
    
    if (error) {
      console.error('Error fetching bid service requests by lead:', error);
      throw new Error('Failed to fetch bid service requests by lead');
    }
    
    return convertKeysToCamelCase(data);
  }

  async createBidServiceRequest(insertRequest) {
    const now = new Date();
    const requestData = {
      status: null,
      notes: null,
      foreclosure_listing_id: null,
      max_bid_amount: null,
      investment_budget: null,
      investment_experience: null,
      preferred_contact_method: null,
      timeframe: null,
      additional_requirements: null,
      assigned_to: null,
      ...insertRequest,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('bid_service_requests')
      .insert([requestData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating bid service request:', error);
      throw new Error('Failed to create bid service request');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updateBidServiceRequest(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('bid_service_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating bid service request:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  // Weekly subscriber methods
  async getWeeklySubscribers() {
    const { data, error } = await supabase
      .from('weekly_subscribers')
      .select('*');
    
    if (error) {
      console.error('Error fetching weekly subscribers:', error);
      throw new Error('Failed to fetch weekly subscribers');
    }
    
    return convertKeysToCamelCase(data);
  }

  async getWeeklySubscriber(id) {
    const { data, error } = await supabase
      .from('weekly_subscribers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching weekly subscriber:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async createWeeklySubscriber(insertSubscriber) {
    const subscriberData = {
      status: "pending",
      notes: null,
      ...insertSubscriber,
      created_at: new Date()
    };

    const { data, error } = await supabase
      .from('weekly_subscribers')
      .insert([subscriberData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating weekly subscriber:', error);
      throw new Error('Failed to create weekly subscriber');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updateWeeklySubscriber(id, updates) {
    const updateData = {
      ...updates
    };

    const { data, error } = await supabase
      .from('weekly_subscribers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating weekly subscriber:', error);
      return null;
    }

    return convertKeysToCamelCase(data);
  }

  // Institutional Investor methods
  async getInstitutionalInvestor(id) {
    const { data, error } = await supabase
      .from('institutional_investors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching institutional investor:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async getInstitutionalInvestorByEmail(email) {
    const { data, error } = await supabase
      .from('institutional_investors')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching institutional investor by email:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async registerInstitutionalInvestor(insertInstitutionalInvestor) {
    const now = new Date();
    const institutionalInvestorData = {
      status: "pending",
      is_active: false,
      created_at: now,
      updated_at: now,
      ...insertInstitutionalInvestor
    };

    const { data, error } = await supabase
      .from('institutional_investors')
      .insert([institutionalInvestorData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating institutional investor:', error);
      throw new Error('Failed to create institutional investor');
    }
    
    return convertKeysToCamelCase(data);
  }

  async authenticateInstitutionalInvestor(email, password) {
    const institutionalInvestor = await this.getInstitutionalInvestorByEmail(email);
    if (institutionalInvestor && institutionalInvestor.password === password) {
      return institutionalInvestor;
    }
    return null;
  }

  async approveInstitutionalInvestor(id, approvedBy) {
    const updateData = {
      status: "approved",
      is_active: true,
      approved_at: new Date(),
      approved_by: approvedBy,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('institutional_investors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error approving institutional investor:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async createInstitutionalInvestor(insertInstitutionalInvestor) {
    const now = new Date();
    const institutionalInvestorData = {
      status: "pending",
      is_active: false,
      created_at: now,
      updated_at: now,
      ...insertInstitutionalInvestor
    };

    const { data, error } = await supabase
      .from('institutional_investors')
      .insert([institutionalInvestorData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating institutional investor:', error);
      throw new Error('Failed to create institutional investor');
    }
    
    return convertKeysToCamelCase(data);
  }

  // Add missing methods for admin functionality

  // Users methods
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
    
    return convertKeysToCamelCase(data);
  }

  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }
    
    return true;
  }

  // Institutional Investors methods
  async getInstitutionalInvestors() {
    const { data, error } = await supabase
      .from('institutional_investors')
      .select('*');
    
    if (error) {
      console.error('Error fetching institutional investors:', error);
      throw new Error('Failed to fetch institutional investors');
    }
    
    return convertKeysToCamelCase(data);
  }

  async updateInstitutionalInvestor(id, updates) {
    const updateData = {
      ...updates,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('institutional_investors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating institutional investor:', error);
      return null;
    }
    
    return convertKeysToCamelCase(data);
  }

  async deleteInstitutionalInvestor(id) {
    const { error } = await supabase
      .from('institutional_investors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting institutional investor:', error);
      return false;
    }
    
    return true;
  }

  async deleteForeclosureListing(id) {
    const { error } = await supabase
      .from('foreclosure_listings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting foreclosure listing:', error);
      return false;
    }
    
    return true;
  }


}
