// server/index.ts
import express2 from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
import { SupabaseStorage } from "./supabase-storage.js";

var MemStorage = class {
  users;
  partners;
  properties;
  leads;
  offers;
  communications;
  foreclosureListings;
  foreclosureSubscriptions;
  bidServiceRequests;
  weeklySubscribers;
  institutionalInvestors;
  institutionalSessions;
  institutionalBids;
  institutionalForeclosureLists;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.partners = /* @__PURE__ */ new Map();
    this.properties = /* @__PURE__ */ new Map();
    this.leads = /* @__PURE__ */ new Map();
    this.offers = /* @__PURE__ */ new Map();
    this.communications = /* @__PURE__ */ new Map();
    this.foreclosureListings = /* @__PURE__ */ new Map();
    this.foreclosureSubscriptions = /* @__PURE__ */ new Map();
    this.bidServiceRequests = /* @__PURE__ */ new Map();
    this.weeklySubscribers = /* @__PURE__ */ new Map();
    this.institutionalInvestors = /* @__PURE__ */ new Map();
    this.institutionalSessions = /* @__PURE__ */ new Map();
    this.institutionalBids = /* @__PURE__ */ new Map();
    this.institutionalForeclosureLists = /* @__PURE__ */ new Map();
    this.seedSampleData();
  }
  seedSampleData() {
    // No need to seed sample data when using Supabase
    // Data will be fetched from the database
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Partner methods
  async getPartners() {
    return Array.from(this.partners.values());
  }
  async getPartner(id) {
    return this.partners.get(id);
  }
  async getPartnerByUsername(username) {
    return Array.from(this.partners.values()).find(
      (partner) => partner.username === username
    );
  }
  async getPartnerByEmail(email) {
    return Array.from(this.partners.values()).find(
      (partner) => partner.email === email
    );
  }
  async getPartnerByEmailToken(token) {
    return Array.from(this.partners.values()).find(
      (partner) => partner.emailVerificationToken === token
    );
  }
  async createPartner(insertPartner) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const partner = {
      ...insertPartner,
      company: insertPartner.company || null,
      phone: insertPartner.phone || null,
      isActive: insertPartner.isActive ?? true,
      approvalStatus: insertPartner.approvalStatus || "pending",
      approvedAt: insertPartner.approvedAt || null,
      approvedBy: insertPartner.approvedBy || null,
      rejectionReason: insertPartner.rejectionReason || null,
      emailVerified: insertPartner.emailVerified ?? false,
      emailVerificationToken: insertPartner.emailVerificationToken || null,
      emailVerificationSentAt: insertPartner.emailVerificationSentAt || null,
      emailVerifiedAt: insertPartner.emailVerifiedAt || null,
      phoneVerified: insertPartner.phoneVerified ?? false,
      phoneVerificationCode: insertPartner.phoneVerificationCode || null,
      phoneVerificationSentAt: insertPartner.phoneVerificationSentAt || null,
      phoneVerifiedAt: insertPartner.phoneVerifiedAt || null,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.partners.set(id, partner);
    return partner;
  }
  async updatePartner(id, updates) {
    const partner = this.partners.get(id);
    if (!partner) return void 0;
    const updatedPartner = {
      ...partner,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.partners.set(id, updatedPartner);
    return updatedPartner;
  }
  async authenticatePartner(username, password) {
    const partner = await this.getPartnerByUsername(username);
    if (partner && partner.password === password && partner.isActive && partner.emailVerified && partner.phoneVerified && partner.approvalStatus === "approved") {
      return partner;
    }
    return null;
  }
  // Property methods
  async getProperties() {
    return Array.from(this.properties.values()).filter((p) => p.isActive);
  }
  async getProperty(id) {
    return this.properties.get(id);
  }
  async createProperty(insertProperty) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const property = {
      beds: null,
      baths: null,
      sqft: null,
      units: null,
      arv: null,
      estimatedProfit: null,
      annualIncome: null,
      capRate: null,
      condition: null,
      access: "Available with Appointment",
      images: null,
      description: null,
      googleSheetsRowId: null,
      partnerId: null,
      source: "internal",
      status: "available",
      isActive: true,
      ...insertProperty,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.properties.set(id, property);
    return property;
  }
  async updateProperty(id, updates) {
    const property = this.properties.get(id);
    if (!property) return void 0;
    const updatedProperty = {
      ...property,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  async deleteProperty(id) {
    return this.properties.delete(id);
  }
  // Lead methods
  async getLeads() {
    return Array.from(this.leads.values());
  }
  async getLead(id) {
    return this.leads.get(id);
  }
  async getLeadsByType(type) {
    return Array.from(this.leads.values()).filter((lead) => lead.type === type);
  }
  async getLeadByEmailToken(token) {
    return Array.from(this.leads.values()).find((lead) => lead.emailVerificationToken === token);
  }
  async createLead(insertLead) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const lead = {
      motivation: null,
      timeline: null,
      budget: null,
      preferredAreas: null,
      experienceLevel: null,
      propertyDetails: null,
      notes: null,
      status: "new",
      emailVerified: false,
      phoneVerified: false,
      emailVerificationToken: null,
      phoneVerificationCode: null,
      emailVerificationSentAt: null,
      phoneVerificationSentAt: null,
      emailVerifiedAt: null,
      phoneVerifiedAt: null,
      ...insertLead,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.leads.set(id, lead);
    return lead;
  }
  async updateLead(id, updates) {
    const lead = this.leads.get(id);
    if (!lead) return void 0;
    const updatedLead = {
      ...lead,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }
  // Offer methods
  async getOffers() {
    return Array.from(this.offers.values());
  }
  async getOffer(id) {
    return this.offers.get(id);
  }
  async getOffersByProperty(propertyId) {
    return Array.from(this.offers.values()).filter((offer) => offer.propertyId === propertyId);
  }
  async createOffer(insertOffer) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const offer = {
      terms: null,
      offerLetterUrl: null,
      proofOfFundsUrl: null,
      closingDate: null,
      downPayment: null,
      financingType: null,
      contingencies: null,
      additionalTerms: null,
      signedAt: null,
      status: "pending",
      ...insertOffer,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.offers.set(id, offer);
    return offer;
  }
  async updateOffer(id, updates) {
    const offer = this.offers.get(id);
    if (!offer) return void 0;
    const updatedOffer = {
      ...offer,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.offers.set(id, updatedOffer);
    return updatedOffer;
  }
  // Communication methods
  async getCommunications() {
    return Array.from(this.communications.values());
  }
  async getCommunicationsByLead(leadId) {
    return Array.from(this.communications.values()).filter((comm) => comm.leadId === leadId);
  }
  async createCommunication(insertCommunication) {
    const id = randomUUID();
    const communication = {
      subject: null,
      content: null,
      scheduledFor: null,
      sentAt: null,
      status: "sent",
      ...insertCommunication,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.communications.set(id, communication);
    return communication;
  }
  // Foreclosure listing methods
  async getForeclosureListings() {
    return Array.from(this.foreclosureListings.values()).filter((listing) => listing.isActive);
  }
  async getForeclosureListing(id) {
    return this.foreclosureListings.get(id);
  }
  async getForeclosureListingsByCounty(county) {
    return Array.from(this.foreclosureListings.values()).filter(
      (listing) => listing.county === county && listing.isActive
    );
  }
  async createForeclosureListing(insertListing) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const listing = {
      propertyType: null,
      beds: null,
      baths: null,
      sqft: null,
      yearBuilt: null,
      description: null,
      docketNumber: null,
      plaintiff: null,
      startingBid: null,
      assessedValue: null,
      status: "upcoming",
      isActive: true,
      ...insertListing,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.foreclosureListings.set(id, listing);
    return listing;
  }
  async updateForeclosureListing(id, updates) {
    const listing = this.foreclosureListings.get(id);
    if (!listing) return void 0;
    const updatedListing = {
      ...listing,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.foreclosureListings.set(id, updatedListing);
    return updatedListing;
  }
  // Foreclosure subscription methods
  async getForeclosureSubscriptions() {
    return Array.from(this.foreclosureSubscriptions.values());
  }
  async getForeclosureSubscription(id) {
    return this.foreclosureSubscriptions.get(id);
  }
  async getForeclosureSubscriptionsByLead(leadId) {
    return Array.from(this.foreclosureSubscriptions.values()).filter(
      (subscription) => subscription.leadId === leadId
    );
  }
  async createForeclosureSubscription(insertSubscription) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const subscription = {
      isActive: true,
      lastSent: null,
      ...insertSubscription,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.foreclosureSubscriptions.set(id, subscription);
    return subscription;
  }
  async updateForeclosureSubscription(id, updates) {
    const subscription = this.foreclosureSubscriptions.get(id);
    if (!subscription) return void 0;
    const updatedSubscription = {
      ...subscription,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.foreclosureSubscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  // Bid service request methods
  async getBidServiceRequests() {
    return Array.from(this.bidServiceRequests.values());
  }
  async getBidServiceRequest(id) {
    return this.bidServiceRequests.get(id);
  }
  async getBidServiceRequestsByLead(leadId) {
    return Array.from(this.bidServiceRequests.values()).filter(
      (request) => request.leadId === leadId
    );
  }
  async createBidServiceRequest(insertRequest) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const request = {
      status: null,
      notes: null,
      foreclosureListingId: null,
      maxBidAmount: null,
      investmentBudget: null,
      investmentExperience: null,
      preferredContactMethod: null,
      timeframe: null,
      additionalRequirements: null,
      assignedTo: null,
      ...insertRequest,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.bidServiceRequests.set(id, request);
    return request;
  }
  async updateBidServiceRequest(id, updates) {
    const request = this.bidServiceRequests.get(id);
    if (!request) return void 0;
    const updatedRequest = {
      ...request,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.bidServiceRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  // Weekly subscriber methods
  async getWeeklySubscribers() {
    return Array.from(this.weeklySubscribers.values());
  }
  async getWeeklySubscriber(id) {
    return this.weeklySubscribers.get(id);
  }
  async createWeeklySubscriber(insertSubscriber) {
    const id = randomUUID();
    const subscriber = {
      status: "pending",
      notes: null,
      ...insertSubscriber,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.weeklySubscribers.set(id, subscriber);
    return subscriber;
  }
  async updateWeeklySubscriber(id, updates) {
    const subscriber = this.weeklySubscribers.get(id);
    if (!subscriber) return void 0;
    const updatedSubscriber = {
      ...subscriber,
      ...updates
    };
    this.weeklySubscribers.set(id, updatedSubscriber);
    return updatedSubscriber;
  }
  // Institutional investor methods
  async getInstitutionalInvestor(id) {
    return this.institutionalInvestors.get(id);
  }
  async getInstitutionalInvestorByUsername(username) {
    for (const investor of this.institutionalInvestors.values()) {
      if (investor.username === username) {
        return investor;
      }
    }
    return void 0;
  }
  async getInstitutionalInvestorByEmail(email) {
    for (const investor of this.institutionalInvestors.values()) {
      if (investor.email === email) {
        return investor;
      }
    }
    return void 0;
  }
  async createInstitutionalInvestor(insertInvestor) {
    const id = randomUUID();
    const investor = {
      ...insertInvestor,
      id,
      status: "pending",
      isActive: false,
      username: null,
      password: null,
      approvedAt: null,
      approvedBy: null,
      lastLoginAt: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.institutionalInvestors.set(id, investor);
    return investor;
  }
  async approveInstitutionalInvestor(id, username, hashedPassword, approvedBy) {
    const investor = this.institutionalInvestors.get(id);
    if (!investor) return void 0;
    const updatedInvestor = {
      ...investor,
      status: "approved",
      isActive: true,
      username,
      password: hashedPassword,
      approvedAt: /* @__PURE__ */ new Date(),
      approvedBy,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.institutionalInvestors.set(id, updatedInvestor);
    return updatedInvestor;
  }
  async updateInstitutionalInvestorLastLogin(id) {
    const investor = this.institutionalInvestors.get(id);
    if (investor) {
      investor.lastLoginAt = /* @__PURE__ */ new Date();
      investor.updatedAt = /* @__PURE__ */ new Date();
      this.institutionalInvestors.set(id, investor);
    }
  }
  // Institutional session methods
  async createInstitutionalSession(investorId, sessionToken, expiresAt) {
    this.institutionalSessions.set(sessionToken, { investorId, expiresAt });
  }
  async getInstitutionalSession(sessionToken) {
    return this.institutionalSessions.get(sessionToken);
  }
  async deleteInstitutionalSession(sessionToken) {
    this.institutionalSessions.delete(sessionToken);
  }
  // Institutional bid tracking methods
  async createInstitutionalBid(insertBid) {
    const id = randomUUID();
    const bid = {
      ...insertBid,
      id,
      status: "submitted",
      notes: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.institutionalBids.set(id, bid);
    return bid;
  }
  async getInstitutionalBidsByInvestor(investorId) {
    const bids = [];
    for (const bid of this.institutionalBids.values()) {
      if (bid.investorId === investorId) {
        bids.push(bid);
      }
    }
    return bids.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async updateInstitutionalBidStatus(bidId, status, notes) {
    const bid = this.institutionalBids.get(bidId);
    if (!bid) return void 0;
    const updatedBid = {
      ...bid,
      status,
      notes: notes || bid.notes,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.institutionalBids.set(bidId, updatedBid);
    return updatedBid;
  }
  // Institutional foreclosure list methods
  async createInstitutionalForeclosureList(insertList) {
    const id = randomUUID();
    const list = {
      ...insertList,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.institutionalForeclosureLists.set(id, list);
    return list;
  }
  async getInstitutionalForeclosureLists() {
    return Array.from(this.institutionalForeclosureLists.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getLatestInstitutionalForeclosureList() {
    const lists = await this.getInstitutionalForeclosureLists();
    return lists[0];
  }
  
  // Admin authentication method
  async authenticateAdmin(username, password) {
    // First check hardcoded admin credentials for demo purposes
    if (username === "admin" && password === "admin123") {
      return { 
        id: "admin-demo", 
        username: "admin", 
        role: "administrator",
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User"
      };
    }
    
    // Then check in the users collection for admin users
    for (const user of this.users.values()) {
      if (user.username === username && user.role === "admin") {
        // In a real implementation, you would check the hashed password
        // For now, we'll do a simple check
        if (user.password === password) {
          return {
            id: user.id,
            username: user.username,
            role: "administrator",
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          };
        }
      }
    }
    
    return null;
  }
};
var storage = new SupabaseStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  // Approval workflow fields
  approvalStatus: text("approval_status").notNull().default("pending"),
  // pending, approved, rejected
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by"),
  rejectionReason: text("rejection_reason"),
  // Email verification fields
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationSentAt: timestamp("email_verification_sent_at"),
  emailVerifiedAt: timestamp("email_verified_at"),
  // Phone verification fields
  phoneVerified: boolean("phone_verified").notNull().default(false),
  phoneVerificationCode: text("phone_verification_code"),
  phoneVerificationSentAt: timestamp("phone_verification_sent_at"),
  phoneVerifiedAt: timestamp("phone_verified_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull(),
  neighborhood: text("neighborhood").notNull(),
  borough: text("borough").notNull(),
  propertyType: text("property_type").notNull(),
  beds: integer("beds"),
  baths: decimal("baths"),
  sqft: integer("sqft"),
  units: integer("units"),
  price: decimal("price").notNull(),
  arv: decimal("arv"),
  estimatedProfit: decimal("estimated_profit"),
  capRate: decimal("cap_rate"),
  annualIncome: decimal("annual_income"),
  condition: text("condition"),
  access: text("access").notNull().default("Available with Appointment"),
  images: text("images").array(),
  description: text("description"),
  googleSheetsRowId: text("google_sheets_row_id"),
  // Track Google Sheets row for updates
  partnerId: varchar("partner_id").references(() => partners.id),
  // Partner who posted the property
  source: text("source").notNull().default("internal"),
  // internal, partner, google_sheets
  status: text("status").notNull().default("available"),
  // available, under_contract, sold
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  // seller, buyer
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  source: text("source").notNull(),
  // website_form, manual_entry
  status: text("status").notNull().default("new"),
  // new, contacted, qualified, converted, closed
  motivation: text("motivation"),
  timeline: text("timeline"),
  budget: text("budget"),
  preferredAreas: text("preferred_areas").array(),
  experienceLevel: text("experience_level"),
  propertyDetails: jsonb("property_details"),
  // For seller leads
  notes: text("notes"),
  // Email verification fields
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationSentAt: timestamp("email_verification_sent_at"),
  emailVerifiedAt: timestamp("email_verified_at"),
  // Phone verification fields
  phoneVerified: boolean("phone_verified").notNull().default(false),
  phoneVerificationCode: text("phone_verification_code"),
  phoneVerificationSentAt: timestamp("phone_verification_sent_at"),
  phoneVerifiedAt: timestamp("phone_verified_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var offers = pgTable("offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  buyerLeadId: varchar("buyer_lead_id").notNull().references(() => leads.id),
  offerAmount: decimal("offer_amount").notNull(),
  terms: text("terms"),
  status: text("status").notNull().default("pending"),
  // pending, accepted, rejected, countered
  offerLetterUrl: text("offer_letter_url"),
  // Uploaded offer letter document
  proofOfFundsUrl: text("proof_of_funds_url"),
  // Uploaded proof of funds document
  closingDate: text("closing_date"),
  downPayment: decimal("down_payment"),
  financingType: text("financing_type"),
  // cash, conventional, fha, etc.
  contingencies: text("contingencies"),
  additionalTerms: text("additional_terms"),
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var communications = pgTable("communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id),
  type: text("type").notNull(),
  // email, sms, call, meeting
  direction: text("direction").notNull(),
  // inbound, outbound
  subject: text("subject"),
  content: text("content"),
  status: text("status").notNull().default("sent"),
  // sent, delivered, read, failed
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var foreclosureListings = pgTable("foreclosure_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull(),
  county: text("county").notNull(),
  // Queens, Brooklyn, Nassau, Suffolk
  auctionDate: timestamp("auction_date").notNull(),
  startingBid: decimal("starting_bid"),
  assessedValue: decimal("assessed_value"),
  propertyType: text("property_type"),
  beds: integer("beds"),
  baths: decimal("baths"),
  sqft: integer("sqft"),
  yearBuilt: integer("year_built"),
  description: text("description"),
  docketNumber: text("docket_number"),
  plaintiff: text("plaintiff"),
  status: text("status").notNull().default("upcoming"),
  // upcoming, completed, cancelled
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var foreclosureSubscriptions = pgTable("foreclosure_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id),
  counties: text("counties").array().notNull(),
  // Selected counties
  subscriptionType: text("subscription_type").notNull(),
  // weekly, instant
  isActive: boolean("is_active").notNull().default(true),
  lastSent: timestamp("last_sent"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true
});
var insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCommunicationSchema = createInsertSchema(communications).omit({
  id: true,
  createdAt: true
});
var insertForeclosureListingSchema = createInsertSchema(foreclosureListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertForeclosureSubscriptionSchema = createInsertSchema(foreclosureSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var bidServiceRequests = pgTable("bid_service_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id),
  foreclosureListingId: varchar("foreclosure_listing_id").references(() => foreclosureListings.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  investmentBudget: varchar("investment_budget", { length: 100 }),
  maxBidAmount: varchar("max_bid_amount", { length: 100 }),
  investmentExperience: varchar("investment_experience", { length: 50 }),
  preferredContactMethod: varchar("preferred_contact_method", { length: 50 }),
  timeframe: varchar("timeframe", { length: 100 }),
  additionalRequirements: text("additional_requirements"),
  status: varchar("status", { length: 50 }).default("pending"),
  assignedTo: varchar("assigned_to", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertBidServiceRequestSchema = createInsertSchema(bidServiceRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var weeklySubscribers = pgTable("weekly_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  counties: text("counties").array().notNull(),
  planType: varchar("plan_type", { length: 50 }).notNull(),
  // 'weekly' or 'monthly'
  status: varchar("status", { length: 50 }).default("pending"),
  // 'pending', 'contacted', 'subscribed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  notes: text("notes")
});
var insertWeeklySubscriberSchema = createInsertSchema(weeklySubscribers).omit({
  id: true,
  createdAt: true
});
var institutionalInvestors = pgTable("institutional_investors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personName: varchar("person_name").notNull(),
  institutionName: varchar("institution_name").notNull(),
  jobTitle: varchar("job_title").notNull(),
  email: varchar("email").unique().notNull(),
  workPhone: varchar("work_phone").notNull(),
  personalPhone: varchar("personal_phone").notNull(),
  businessCardUrl: varchar("business_card_url"),
  status: varchar("status").notNull().default("pending"),
  // pending, approved, rejected
  username: varchar("username").unique(),
  password: varchar("password"),
  isActive: boolean("is_active").default(false),
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var institutionalSessions = pgTable("institutional_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  investorId: varchar("investor_id").notNull().references(() => institutionalInvestors.id, { onDelete: "cascade" }),
  sessionToken: varchar("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var institutionalForeclosureLists = pgTable("institutional_foreclosure_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekOfDate: timestamp("week_of_date").notNull(),
  properties: jsonb("properties").notNull(),
  // Array of property objects
  totalProperties: integer("total_properties").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var institutionalBidTracking = pgTable("institutional_bid_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  investorId: varchar("investor_id").notNull().references(() => institutionalInvestors.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id"),
  // Can be null for foreclosure properties
  propertyAddress: varchar("property_address").notNull(),
  bidAmount: varchar("bid_amount").notNull(),
  auctionDate: timestamp("auction_date").notNull(),
  status: varchar("status").notNull().default("submitted"),
  // submitted, won, lost, pending
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var institutionalWeeklyDeliveries = pgTable("institutional_weekly_deliveries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  investorId: varchar("investor_id").notNull().references(() => institutionalInvestors.id, { onDelete: "cascade" }),
  foreclosureListId: varchar("foreclosure_list_id").notNull().references(() => institutionalForeclosureLists.id, { onDelete: "cascade" }),
  deliveredAt: timestamp("delivered_at").defaultNow(),
  emailSent: boolean("email_sent").default(false)
});
var insertInstitutionalInvestorSchema = createInsertSchema(institutionalInvestors).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertInstitutionalBidTrackingSchema = createInsertSchema(institutionalBidTracking).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertInstitutionalForeclosureListSchema = createInsertSchema(institutionalForeclosureLists).omit({
  id: true,
  createdAt: true
});

// server/verification.ts
import { randomBytes } from "crypto";
function generateEmailVerificationToken() {
  return randomBytes(32).toString("hex");
}
function generatePhoneVerificationCode() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
async function sendEmailVerification(email, token, name) {
  console.log(`
\u{1F4E7} EMAIL VERIFICATION`);
  console.log(`To: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`Verification Link: http://localhost:5000/verify-email?token=${token}`);
  console.log(`
Subject: Verify Your Email - Investor Properties NY`);
  console.log(`
Hi ${name},

Welcome to Investor Properties NY! Please verify your email address by clicking the link below:

http://localhost:5000/verify-email?token=${token}

This link will expire in 24 hours.

Best regards,
Investor Properties NY Team`);
  return true;
}
async function sendPhoneVerification(phone, code, name) {
  console.log(`
\u{1F4F1} SMS VERIFICATION`);
  console.log(`To: ${phone}`);
  console.log(`Name: ${name}`);
  console.log(`Verification Code: ${code}`);
  console.log(`
Message: Hi ${name}, your Investor Properties NY verification code is: ${code}. This code expires in 10 minutes.`);
  return true;
}
function isVerificationValid(sentAt, type) {
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - sentAt.getTime();
  const maxAgeMs = type === "email" ? 24 * 60 * 60 * 1e3 : 10 * 60 * 1e3;
  return diffMs <= maxAgeMs;
}

// server/google-sheets.ts
var GoogleSheetsService = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async fetchProperties() {
    try {
      const sampleData = [
        {
          rowId: "1",
          address: "123 Brooklyn Heights Ave",
          neighborhood: "Brooklyn Heights",
          borough: "Brooklyn",
          propertyType: "Multi-Family",
          beds: 6,
          baths: 4,
          sqft: 2800,
          units: 3,
          price: "850000",
          arv: "1100000",
          estimatedProfit: "180000",
          capRate: "7.2",
          annualIncome: "84000",
          condition: "Good",
          description: "Beautiful pre-war building in prime Brooklyn Heights location. Recently renovated with modern amenities while maintaining original charm. Three units with excellent rental history and strong upside potential. Walking distance to Brooklyn Bridge Park and all major transportation.",
          images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
            "https://images.unsplash.com/photo-1605146769289-440113cc3d00"
          ],
          status: "available"
        },
        {
          rowId: "2",
          address: "456 Astoria Boulevard",
          neighborhood: "Astoria",
          borough: "Queens",
          propertyType: "Single Family",
          beds: 4,
          baths: 3,
          sqft: 2200,
          units: 1,
          price: "675000",
          arv: "850000",
          estimatedProfit: "125000",
          capRate: "8.1",
          annualIncome: "54000",
          condition: "Good",
          description: "Spacious single-family home in desirable Astoria neighborhood. Features include updated kitchen, hardwood floors throughout, and private backyard. Great for both rental income and future appreciation. Close to N/W trains and local amenities.",
          images: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
            "https://images.unsplash.com/photo-1554995207-c18c203602cb"
          ],
          status: "available"
        },
        {
          rowId: "3",
          address: "789 Park Slope Street",
          neighborhood: "Park Slope",
          borough: "Brooklyn",
          propertyType: "Multi-Family",
          beds: 8,
          baths: 6,
          sqft: 3500,
          units: 4,
          price: "1200000",
          arv: "1450000",
          estimatedProfit: "180000",
          capRate: "6.8",
          annualIncome: "96000",
          condition: "Excellent",
          description: "Premium four-family brownstone in coveted Park Slope location. Fully renovated with luxury finishes, separate entrances, and strong rental demand. Perfect for sophisticated investors seeking trophy assets in Brooklyn's most desirable neighborhood.",
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"
          ],
          status: "available"
        },
        {
          rowId: "4",
          address: "321 Long Island City Plaza",
          neighborhood: "Long Island City",
          borough: "Queens",
          propertyType: "Condo",
          beds: 2,
          baths: 2,
          sqft: 1200,
          units: 1,
          price: "485000",
          arv: "580000",
          estimatedProfit: "75000",
          capRate: "9.2",
          annualIncome: "42000",
          condition: "Excellent",
          description: "Modern luxury condo in LIC's fastest-growing neighborhood. Floor-to-ceiling windows with Manhattan skyline views, in-unit washer/dryer, and building amenities. Strong rental demand from young professionals working in Manhattan.",
          images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
          ],
          status: "available"
        },
        {
          rowId: "5",
          address: "567 Williamsburg Avenue",
          neighborhood: "Williamsburg",
          borough: "Brooklyn",
          propertyType: "Multi-Family",
          beds: 10,
          baths: 8,
          sqft: 4200,
          units: 5,
          price: "1650000",
          arv: "1950000",
          estimatedProfit: "220000",
          capRate: "7.5",
          annualIncome: "132000",
          condition: "Good",
          description: "Large five-family building in trendy Williamsburg. Mix of renovated and value-add units providing immediate income and upside potential. Walking distance to multiple subway lines, restaurants, and nightlife. Perfect for investors seeking scale.",
          images: [
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
            "https://images.unsplash.com/photo-1605146769289-440113cc3d00"
          ],
          status: "available"
        }
      ];
      return sampleData;
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
      throw new Error("Failed to fetch properties from Google Sheets");
    }
  }
  convertToInsertProperty(row) {
    return {
      address: row.address,
      neighborhood: row.neighborhood,
      borough: row.borough,
      propertyType: row.propertyType,
      beds: row.beds || null,
      baths: row.baths?.toString() || null,
      sqft: row.sqft || null,
      units: row.units || null,
      price: row.price,
      arv: row.arv || null,
      estimatedProfit: row.estimatedProfit || null,
      capRate: row.capRate || null,
      annualIncome: row.annualIncome || null,
      condition: row.condition || null,
      images: row.images || null,
      description: row.description || null,
      googleSheetsRowId: row.rowId,
      status: row.status || "available",
      isActive: true
    };
  }
  // Method to sync properties from Google Sheets
  async syncProperties() {
    const rows = await this.fetchProperties();
    return rows.map((row) => this.convertToInsertProperty(row));
  }
  // Validate Google Sheets connection
  async validateConnection() {
    try {
      await this.fetchProperties();
      return true;
    } catch (error) {
      return false;
    }
  }
};
function createGoogleSheetsService(config) {
  const defaultConfig = {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID || "demo-spreadsheet",
    range: "Properties!A:Z",
    apiKey: process.env.GOOGLE_SHEETS_API_KEY
  };
  return new GoogleSheetsService({
    ...defaultConfig,
    ...config
  });
}

// server/institutional-auth.ts
import bcrypt from "bcrypt";
import crypto from "crypto";
var isInstitutionallyAuthenticated = async (req, res, next) => {
  try {
    const sessionToken = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.institutional_session;
    if (!sessionToken) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const session2 = await storage.getInstitutionalSession(sessionToken);
    if (!session2 || /* @__PURE__ */ new Date() > session2.expiresAt) {
      return res.status(401).json({ message: "Session expired" });
    }
    const investor = await storage.getInstitutionalInvestor(session2.investorId);
    if (!investor || !investor.isActive || investor.status !== "approved") {
      return res.status(401).json({ message: "Account not active or approved" });
    }
    req.institutionalInvestor = investor;
    next();
  } catch (error) {
    console.error("Institutional authentication error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};
var loginInstitutionalInvestor = async (username, password) => {
  const investor = await storage.getInstitutionalInvestorByUsername(username);
  if (!investor || !investor.password) {
    throw new Error("Invalid credentials");
  }
  if (investor.status !== "approved" || !investor.isActive) {
    throw new Error("Account not approved or inactive");
  }
  const isValidPassword = await bcrypt.compare(password, investor.password);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3);
  await storage.createInstitutionalSession(investor.id, sessionToken, expiresAt);
  await storage.updateInstitutionalInvestorLastLogin(investor.id);
  return {
    investor: {
      id: investor.id,
      personName: investor.personName,
      institutionName: investor.institutionName,
      email: investor.email,
      jobTitle: investor.jobTitle
    },
    sessionToken,
    expiresAt
  };
};
var approveInstitutionalInvestor = async (investorId, username, password, approvedBy) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await storage.approveInstitutionalInvestor(investorId, username, hashedPassword, approvedBy);
};

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/partners/register", async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, company, phone } = req.body;
      const existingUsername = await storage.getPartnerByUsername(username);
      const existingEmail = await storage.getPartnerByEmail(email);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const emailToken = generateEmailVerificationToken();
      const phoneCode = generatePhoneVerificationCode();
      const partnerData = {
        username,
        password,
        // In production, hash this
        email,
        firstName,
        lastName,
        company,
        phone,
        isActive: true,
        emailVerified: false,
        emailVerificationToken: emailToken,
        emailVerificationSentAt: /* @__PURE__ */ new Date(),
        phoneVerified: false,
        phoneVerificationCode: phoneCode,
        phoneVerificationSentAt: /* @__PURE__ */ new Date()
      };
      const partner = await storage.createPartner(partnerData);
      try {
        await sendEmailVerification(email, emailToken, firstName);
        await sendPhoneVerification(phone, phoneCode, firstName);
      } catch (verificationError) {
        console.log("Verification sending failed:", verificationError);
      }
      res.status(201).json({
        success: true,
        message: "Registration successful. Please check your email and phone for verification codes.",
        partnerId: partner.id,
        requiresVerification: true
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/partners/verify-email", async (req, res) => {
    try {
      const { token } = req.body;
      const partner = await storage.getPartnerByEmailToken(token);
      if (!partner) {
        return res.status(400).json({ message: "Invalid verification token" });
      }
      if (!partner.emailVerificationSentAt || !isVerificationValid(partner.emailVerificationSentAt, "email")) {
        return res.status(400).json({ message: "Verification token expired" });
      }
      await storage.updatePartner(partner.id, {
        emailVerified: true,
        emailVerifiedAt: /* @__PURE__ */ new Date(),
        emailVerificationToken: null
      });
      res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Email verification failed" });
    }
  });
  app2.post("/api/partners/verify-phone", async (req, res) => {
    try {
      const { partnerId, code } = req.body;
      const partner = await storage.getPartner(partnerId);
      if (!partner) {
        return res.status(400).json({ message: "Partner not found" });
      }
      if (partner.phoneVerificationCode !== code) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      if (!partner.phoneVerificationSentAt || !isVerificationValid(partner.phoneVerificationSentAt, "phone")) {
        return res.status(400).json({ message: "Verification code expired" });
      }
      await storage.updatePartner(partner.id, {
        phoneVerified: true,
        phoneVerifiedAt: /* @__PURE__ */ new Date(),
        phoneVerificationCode: null
      });
      res.json({ success: true, message: "Phone verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Phone verification failed" });
    }
  });
  app2.post("/api/partners/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const partner = await storage.authenticatePartner(username, password);
      if (partner) {
        req.session.partnerId = partner.id;
        res.json({ success: true, partner: { id: partner.id, username: partner.username, firstName: partner.firstName, lastName: partner.lastName } });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/partners/logout", async (req, res) => {
    req.session.partnerId = void 0;
    res.json({ success: true });
  });
  app2.get("/api/partners/me", async (req, res) => {
    const partnerId = req.session?.partnerId;
    if (!partnerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const partner = await storage.getPartner(partnerId);
      if (partner && partner.isActive) {
        res.json({ id: partner.id, username: partner.username, firstName: partner.firstName, lastName: partner.lastName });
      } else {
        res.status(401).json({ message: "Invalid session" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get partner info" });
    }
  });

  // User authentication routes
  app2.post("/api/users/register", async (req, res) => {
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
        emailVerificationToken: emailToken,
        emailVerificationSentAt: new Date()
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

  app2.post("/api/users/verify-email", async (req, res) => {
    try {
      const { token } = req.body;
      const user = await storage.getUserByEmailToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid verification token" });
      }
      
      if (!user.emailVerificationSentAt || !isVerificationValid(user.emailVerificationSentAt, "email")) {
        return res.status(400).json({ message: "Verification token expired" });
      }
      
      await storage.updateUser(user.id, {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null
      });
      
      res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Email verification failed" });
    }
  });

  app2.post("/api/users/login", async (req, res) => {
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

  app2.post("/api/users/logout", async (req, res) => {
    req.session.userId = void 0;
    res.json({ success: true });
  });

  app2.get("/api/users/me", async (req, res) => {
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
  app2.get("/api/users/profile", async (req, res) => {
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

  app2.put("/api/users/profile", async (req, res) => {
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
  app2.post("/api/users/offers", async (req, res) => {
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

  app2.get("/api/users/offers", async (req, res) => {
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

  app2.put("/api/users/offers/:offerId", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const offerId = req.params.offerId;
      const { status, terms, financingType, downPayment, closingDate, contingencies, additionalTerms } = req.body;
      const updates = {};
      
      if (status) updates.status = status;
      if (terms) updates.terms = terms;
      if (financingType) updates.financingType = financingType;
      if (downPayment) updates.downPayment = downPayment;
      if (closingDate) updates.closingDate = closingDate;
      if (contingencies) updates.contingencies = contingencies;
      if (additionalTerms) updates.additionalTerms = additionalTerms;
      
      const offer = await storage.updateOffer(offerId, updates);
      
      if (offer) {
        res.json(offer);
      } else {
        res.status(404).json({ message: "Offer not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update offer" });
    }
  });

  app2.delete("/api/users/offers/:offerId", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const offerId = req.params.offerId;
      const success = await storage.deleteOffer(offerId);
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Offer not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete offer" });
    }
  });

  // Communication routes
  app2.get("/api/users/communications", async (req, res) => {
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
      
      // Get communications for these leads
      const allCommunications = [];
      for (const lead of userLeads) {
        const communications = await storage.getCommunicationsByLead(lead.id);
        allCommunications.push(...communications);
      }
      
      res.json(allCommunications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get communications" });
    }
  });

  app2.post("/api/users/communications", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { leadId, type, direction, subject, content } = req.body;
      
      const communication = await storage.createCommunication({
        leadId,
        type,
        direction,
        subject,
        content,
        status: "sent",
        sentAt: new Date()
      });
      
      res.status(201).json(communication);
    } catch (error) {
      res.status(400).json({ message: "Invalid communication data" });
    }
  });

  app2.put("/api/users/communications/:communicationId", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const communicationId = req.params.communicationId;
      const { status, subject, content } = req.body;
      const updates = {};
      
      if (status) updates.status = status;
      if (subject) updates.subject = subject;
      if (content) updates.content = content;
      
      const communication = await storage.updateCommunication(communicationId, updates);
      
      if (communication) {
        res.json(communication);
      } else {
        res.status(404).json({ message: "Communication not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update communication" });
    }
  });

  app2.delete("/api/users/communications/:communicationId", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const communicationId = req.params.communicationId;
      const success = await storage.deleteCommunication(communicationId);
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Communication not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete communication" });
    }
  });

  // Lead routes
  app2.get("/api/users/leads", async (req, res) => {
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
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  app2.get("/api/properties", async (req, res) => {
    try {
      console.log("Fetching properties from Supabase...");
      const properties2 = await storage.getProperties();
      console.log(`Found ${properties2.length} properties`);
      console.log("Sample property:", JSON.stringify(properties2[0], null, 2));
      res.json(properties2);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties", error: error.message });
    }
  });
  
  app2.get("/api/properties/:id", async (req, res) => {
    try {
      console.log(`Fetching property with ID: ${req.params.id}`);
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        console.log("Property not found");
        return res.status(404).json({ message: "Property not found" });
      }
      console.log("Property found:", JSON.stringify(property, null, 2));
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property", error: error.message });
    }
  });
  app2.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const partnerId = req.session?.partnerId;
      if (req.body.source === "partner" && !partnerId) {
        return res.status(401).json({ message: "Partner authentication required" });
      }
      const propertyData = {
        ...validatedData,
        partnerId: partnerId || null,
        source: partnerId ? "partner" : "internal"
      };
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });
  app2.get("/api/leads", async (req, res) => {
    try {
      const type = req.query.type;
      const leads2 = type ? await storage.getLeadsByType(type) : await storage.getLeads();
      res.json(leads2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });
  app2.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      let emailToken = null;
      let phoneCode = null;
      if (validatedData.type === "buyer") {
        emailToken = generateEmailVerificationToken();
        phoneCode = generatePhoneVerificationCode();
      }
      const leadWithVerification = {
        ...validatedData,
        emailVerificationToken: emailToken,
        phoneVerificationCode: phoneCode,
        emailVerificationSentAt: emailToken ? /* @__PURE__ */ new Date() : null,
        phoneVerificationSentAt: phoneCode ? /* @__PURE__ */ new Date() : null
      };
      const lead = await storage.createLead(leadWithVerification);
      const institutionalDetails = req.body.institutionalDetails;
      if (lead.type === "buyer" && emailToken && phoneCode) {
        await sendEmailVerification(lead.email, emailToken, lead.name);
        await sendPhoneVerification(lead.phone, phoneCode, lead.name);
        await storage.createCommunication({
          leadId: lead.id,
          type: "email",
          direction: "outbound",
          subject: "Verify your email - Investor Properties NY",
          content: "Please check your email and phone for verification instructions.",
          status: "sent",
          sentAt: /* @__PURE__ */ new Date()
        });
      } else if (lead.type === "seller" || lead.type === "property_submission" || lead.type === "institutional_investor") {
        if (lead.type === "property_submission") {
          const propertyDetails = lead.propertyDetails;
          const emailSubject = `New Property Submission - ${propertyDetails?.address || "Property"}`;
          const emailContent = `
New Property Submission Details:

Contact Information:
- Name: ${lead.name}
- Email: ${lead.email}
- Phone: ${lead.phone}

Property Details:
- Address: ${propertyDetails?.address}
- Neighborhood: ${propertyDetails?.neighborhood}
- Borough: ${propertyDetails?.borough}
- Bedrooms: ${propertyDetails?.bedrooms}
- Bathrooms: ${propertyDetails?.bathrooms}
- Square Feet: ${propertyDetails?.sqft}
- Units: ${propertyDetails?.units || "N/A"}
- Asking Price: $${propertyDetails?.price}
- ARV: $${propertyDetails?.arv || "Not provided"}
- Estimated Profit: $${propertyDetails?.estimatedProfit || "Not provided"}
- Condition: ${propertyDetails?.condition}
- Access: ${propertyDetails?.access}
- Description: ${propertyDetails?.description || "None provided"}

Source: Quick Property Submit Form
Submitted: ${(/* @__PURE__ */ new Date()).toLocaleString()}
          `;
          console.log("Property Submission Email:");
          console.log("To: info@investorpropertiesny.com");
          console.log("Subject:", emailSubject);
          console.log("Content:", emailContent);
        }
        if (institutionalDetails) {
          const institutionalInvestor = await storage.createInstitutionalInvestor({
            personName: lead.name,
            institutionName: institutionalDetails.institutionName,
            jobTitle: institutionalDetails.jobTitle,
            email: lead.email,
            workPhone: institutionalDetails.workPhone,
            personalPhone: institutionalDetails.personalPhone,
            businessCardUrl: institutionalDetails?.businessCardName || null
          });
          lead.type = "institutional_investor";
          lead.institutionalInvestorId = institutionalInvestor.id;
          const emailSubject = `New Institutional Investor Application - ${institutionalDetails?.institutionName || "Institution"}`;
          const emailContent = `
New Institutional Investor Application (ID: ${institutionalInvestor.id}):

Contact Person:
- Name: ${lead.name}
- Job Title: ${institutionalDetails?.jobTitle}
- Institutional Email: ${lead.email}
- Work Phone: ${institutionalDetails?.workPhone || "Not provided"}
- Personal Phone: ${institutionalDetails?.personalPhone || "Not provided"}

Institution Details:
- Institution Name: ${institutionalDetails?.institutionName}
- Business Card Provided: ${institutionalDetails?.hasBusinessCard ? "Yes" : "No"}
${institutionalDetails?.businessCardName ? `- Business Card File: ${institutionalDetails.businessCardName}` : ""}

Interest Area: Long Island & NYC Foreclosure Auctions
Application Type: Institutional Investor Access
Source: Institutional Investor Form
Submitted: ${(/* @__PURE__ */ new Date()).toLocaleString()}

To approve this application:
1. Verify the business card and institution legitimacy
2. Use the admin panel to approve and create credentials
3. Investor ID: ${institutionalInvestor.id}

PRIORITY: Review within 48 hours as promised
          `;
          console.log("Institutional Investor Application Email:");
          console.log("To: info@investorpropertiesny.com");
          console.log("Subject:", emailSubject);
          console.log("Content:", emailContent);
        }
        await storage.createCommunication({
          leadId: lead.id,
          type: "email",
          direction: "outbound",
          subject: "Thank you for your property submission",
          content: "We've received your property details and will contact you within 24 hours.",
          status: "sent",
          sentAt: /* @__PURE__ */ new Date()
        });
      }
      const { emailVerificationToken, phoneVerificationCode, ...publicLead } = lead;
      res.status(201).json(publicLead);
    } catch (error) {
      console.error("Lead creation error:", error);
      res.status(400).json({ message: "Invalid lead data" });
    }
  });
  app2.put("/api/leads/:id", async (req, res) => {
    try {
      const updates = req.body;
      const lead = await storage.updateLead(req.params.id, updates);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lead" });
    }
  });
  app2.get("/api/offers", async (req, res) => {
    try {
      const propertyId = req.query.propertyId;
      const offers2 = propertyId ? await storage.getOffersByProperty(propertyId) : await storage.getOffers();
      res.json(offers2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });
  app2.post("/api/offers", async (req, res) => {
    try {
      const validatedData = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer(validatedData);
      await storage.createCommunication({
        leadId: offer.buyerLeadId,
        type: "email",
        direction: "outbound",
        subject: "Offer Submitted Successfully",
        content: `Your offer of ${offer.offerAmount} has been submitted for review. We'll contact you within 24 hours with next steps.`,
        status: "sent",
        sentAt: /* @__PURE__ */ new Date()
      });
      await storage.createCommunication({
        leadId: offer.buyerLeadId,
        type: "email",
        direction: "inbound",
        subject: "New Offer Received",
        content: `New offer received for property ${offer.propertyId}. Amount: ${offer.offerAmount}. Review required.`,
        status: "sent",
        sentAt: /* @__PURE__ */ new Date()
      });
      res.status(201).json(offer);
    } catch (error) {
      console.error("Offer creation error:", error);
      res.status(400).json({ message: "Invalid offer data" });
    }
  });
  app2.get("/api/communications/:leadId", async (req, res) => {
    try {
      const communications2 = await storage.getCommunicationsByLead(req.params.leadId);
      res.json(communications2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch communications" });
    }
  });
  app2.post("/api/verify-email", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
      }
      const lead = await storage.getLeadByEmailToken(token);
      if (!lead) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
      if (lead.emailVerificationSentAt && !isVerificationValid(lead.emailVerificationSentAt, "email")) {
        return res.status(400).json({ message: "Verification token has expired" });
      }
      await storage.updateLead(lead.id, {
        emailVerified: true,
        emailVerifiedAt: /* @__PURE__ */ new Date(),
        emailVerificationToken: null
      });
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Verification failed" });
    }
  });
  app2.post("/api/verify-phone", async (req, res) => {
    try {
      const { leadId, code } = req.body;
      if (!leadId || !code) {
        return res.status(400).json({ message: "Lead ID and verification code are required" });
      }
      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      if (lead.phoneVerificationCode !== code) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      if (lead.phoneVerificationSentAt && !isVerificationValid(lead.phoneVerificationSentAt, "phone")) {
        return res.status(400).json({ message: "Verification code has expired" });
      }
      await storage.updateLead(lead.id, {
        phoneVerified: true,
        phoneVerifiedAt: /* @__PURE__ */ new Date(),
        phoneVerificationCode: null
      });
      res.json({ message: "Phone verified successfully" });
    } catch (error) {
      console.error("Phone verification error:", error);
      res.status(500).json({ message: "Verification failed" });
    }
  });
  app2.post("/api/resend-verification", async (req, res) => {
    try {
      const { leadId, type } = req.body;
      if (!leadId || !type || !["email", "phone"].includes(type)) {
        return res.status(400).json({ message: "Lead ID and valid verification type are required" });
      }
      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      if (type === "email" && !lead.emailVerified) {
        const token = generateEmailVerificationToken();
        await storage.updateLead(lead.id, {
          emailVerificationToken: token,
          emailVerificationSentAt: /* @__PURE__ */ new Date()
        });
        await sendEmailVerification(lead.email, token, lead.name);
      } else if (type === "phone" && !lead.phoneVerified) {
        const code = generatePhoneVerificationCode();
        await storage.updateLead(lead.id, {
          phoneVerificationCode: code,
          phoneVerificationSentAt: /* @__PURE__ */ new Date()
        });
        await sendPhoneVerification(lead.phone, code, lead.name);
      }
      res.json({ message: `${type === "email" ? "Email" : "Phone"} verification sent successfully` });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ message: "Failed to resend verification" });
    }
  });
  app2.post("/api/evaluate-property", async (req, res) => {
    try {
      const { address, propertyType, borough } = req.body;
      const estimatedValue = Math.floor(Math.random() * 5e5) + 3e5;
      const cashOffer = Math.floor(estimatedValue * 0.8);
      res.json({
        estimatedValue,
        cashOffer,
        message: "This is a preliminary estimate. We'll contact you for a detailed evaluation."
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to evaluate property" });
    }
  });
  app2.get("/api/foreclosure-listings", async (req, res) => {
    try {
      console.log("Fetching foreclosure listings from Supabase...");
      const county = req.query.county;
      const listings = county ? await storage.getForeclosureListingsByCounty(county) : await storage.getForeclosureListings();
      console.log(`Found ${listings.length} foreclosure listings`);
      console.log("Sample foreclosure listing:", JSON.stringify(listings[0], null, 2));
      res.json(listings);
    } catch (error) {
      console.error("Error fetching foreclosure listings:", error);
      res.status(500).json({ message: "Failed to fetch foreclosure listings", error: error.message });
    }
  });
  
  app2.get("/api/foreclosure-listings/:id", async (req, res) => {
    try {
      console.log(`Fetching foreclosure listing with ID: ${req.params.id}`);
      const listing = await storage.getForeclosureListing(req.params.id);
      if (!listing) {
        console.log("Foreclosure listing not found");
        return res.status(404).json({ message: "Foreclosure listing not found" });
      }
      console.log("Foreclosure listing found:", JSON.stringify(listing, null, 2));
      res.json(listing);
    } catch (error) {
      console.error("Error fetching foreclosure listing:", error);
      res.status(500).json({ message: "Failed to fetch foreclosure listing", error: error.message });
    }
  });
  
  app2.post("/api/foreclosure-listings", async (req, res) => {
    try {
      const validatedData = insertForeclosureListingSchema.parse(req.body);
      const listing = await storage.createForeclosureListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      res.status(400).json({ message: "Invalid foreclosure listing data" });
    }
  });
  app2.get("/api/foreclosure-subscriptions", async (req, res) => {
    try {
      const leadId = req.query.leadId;
      const subscriptions = leadId ? await storage.getForeclosureSubscriptionsByLead(leadId) : await storage.getForeclosureSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch foreclosure subscriptions" });
    }
  });
  app2.post("/api/foreclosure-subscriptions", async (req, res) => {
    try {
      const validatedData = insertForeclosureSubscriptionSchema.parse(req.body);
      const subscription = await storage.createForeclosureSubscription(validatedData);
      await storage.createCommunication({
        leadId: subscription.leadId,
        type: "email",
        direction: "outbound",
        subject: "Foreclosure Alert Subscription Confirmed",
        content: `You're now subscribed to receive foreclosure auction alerts for: ${subscription.counties.join(", ")}`,
        status: "sent",
        sentAt: /* @__PURE__ */ new Date()
      });
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });
  app2.put("/api/foreclosure-subscriptions/:id", async (req, res) => {
    try {
      const updates = req.body;
      const subscription = await storage.updateForeclosureSubscription(req.params.id, updates);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });
  app2.get("/api/bid-service-requests", async (req, res) => {
    try {
      const leadId = req.query.leadId;
      const requests = leadId ? await storage.getBidServiceRequestsByLead(leadId) : await storage.getBidServiceRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bid service requests" });
    }
  });
  app2.post("/api/bid-service-requests", async (req, res) => {
    try {
      const validatedData = insertBidServiceRequestSchema.parse(req.body);
      const request = await storage.createBidServiceRequest(validatedData);
      await storage.createCommunication({
        leadId: request.leadId,
        type: "email",
        direction: "outbound",
        subject: "Bid Service Request Confirmed",
        content: `We've received your bid service request. Our team will review the property and contact you within 24 hours with our bidding strategy.`,
        status: "sent",
        sentAt: /* @__PURE__ */ new Date()
      });
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid bid service request data" });
    }
  });
  app2.put("/api/bid-service-requests/:id", async (req, res) => {
    try {
      const updates = req.body;
      const request = await storage.updateBidServiceRequest(req.params.id, updates);
      if (!request) {
        return res.status(404).json({ message: "Bid service request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to update bid service request" });
    }
  });
  app2.post("/api/sync-properties", async (req, res) => {
    try {
      const googleSheetsService = createGoogleSheetsService();
      const sheetsProperties = await googleSheetsService.syncProperties();
      let syncedCount = 0;
      let updatedCount = 0;
      for (const sheetProperty of sheetsProperties) {
        const existingProperties = await storage.getProperties();
        const existing = existingProperties.find((p) => p.googleSheetsRowId === sheetProperty.googleSheetsRowId);
        if (existing) {
          await storage.updateProperty(existing.id, sheetProperty);
          updatedCount++;
        } else {
          await storage.createProperty(sheetProperty);
          syncedCount++;
        }
      }
      res.json({
        message: "Properties synchronized successfully",
        syncedCount,
        updatedCount,
        totalProcessed: sheetsProperties.length
      });
    } catch (error) {
      console.error("Google Sheets sync error:", error);
      res.status(500).json({ message: "Failed to sync properties from Google Sheets" });
    }
  });
  app2.get("/api/sheets-status", async (req, res) => {
    try {
      const googleSheetsService = createGoogleSheetsService();
      const isConnected = await googleSheetsService.validateConnection();
      res.json({
        connected: isConnected,
        lastSync: (/* @__PURE__ */ new Date()).toISOString(),
        message: isConnected ? "Google Sheets connection active" : "Google Sheets connection unavailable"
      });
    } catch (error) {
      res.status(500).json({
        connected: false,
        message: "Failed to check Google Sheets connection"
      });
    }
  });
  app2.post("/api/weekly-subscribers", async (req, res) => {
    try {
      const parsed = insertWeeklySubscriberSchema.parse(req.body);
      const subscriber = await storage.createWeeklySubscriber(parsed);
      res.json(subscriber);
    } catch (error) {
      console.error("Error creating weekly subscriber:", error);
      res.status(400).json({ error: "Invalid subscriber data" });
    }
  });
  app2.get("/api/weekly-subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getWeeklySubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error getting weekly subscribers:", error);
      res.status(500).json({ error: "Failed to get subscribers" });
    }
  });
  app2.post("/api/institutional/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const { investor, sessionToken, expiresAt } = await loginInstitutionalInvestor(username, password);
      res.cookie("institutional_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1e3
        // 30 days
      });
      res.json({ investor, sessionToken, expiresAt });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });
  app2.post("/api/institutional/logout", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.institutional_session;
      if (sessionToken) {
        await storage.deleteInstitutionalSession(sessionToken);
      }
      res.clearCookie("institutional_session");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });
  app2.get("/api/institutional/me", isInstitutionallyAuthenticated, async (req, res) => {
    res.json({
      id: req.institutionalInvestor.id,
      personName: req.institutionalInvestor.personName,
      institutionName: req.institutionalInvestor.institutionName,
      email: req.institutionalInvestor.email,
      jobTitle: req.institutionalInvestor.jobTitle
    });
  });
  app2.get("/api/institutional/properties", isInstitutionallyAuthenticated, async (req, res) => {
    try {
      const properties2 = await storage.getProperties();
      res.json(properties2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });
  app2.get("/api/institutional/foreclosure-lists", isInstitutionallyAuthenticated, async (req, res) => {
    try {
      const lists = await storage.getInstitutionalForeclosureLists();
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch foreclosure lists" });
    }
  });
  app2.post("/api/institutional/bids", isInstitutionallyAuthenticated, async (req, res) => {
    try {
      const bidData = {
        ...req.body,
        investorId: req.institutionalInvestor.id
      };
      const bid = await storage.createInstitutionalBid(bidData);
      res.status(201).json(bid);
    } catch (error) {
      res.status(500).json({ message: "Failed to create bid" });
    }
  });
  app2.get("/api/institutional/bids", isInstitutionallyAuthenticated, async (req, res) => {
    try {
      const bids = await storage.getInstitutionalBidsByInvestor(req.institutionalInvestor.id);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bids" });
    }
  });
  app2.get("/api/admin/institutional-investors", async (req, res) => {
    try {
      const investors = Array.from(storage.institutionalInvestors.values());
      res.json(investors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investors" });
    }
  });
  app2.post("/api/admin/institutional-investors/:id/approve", async (req, res) => {
    try {
      const { username, password } = req.body;
      const approvedBy = "admin";
      const investor = await approveInstitutionalInvestor(req.params.id, username, password, approvedBy);
      if (!investor) {
        return res.status(404).json({ message: "Investor not found" });
      }
      res.json(investor);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve investor" });
    }
  });
  app2.post("/api/admin/foreclosure-lists", async (req, res) => {
    try {
      const list = await storage.createInstitutionalForeclosureList(req.body);
      res.status(201).json(list);
    } catch (error) {
      res.status(500).json({ message: "Failed to create foreclosure list" });
    }
  });
  app2.get("/api/admin/partners", async (req, res) => {
    try {
      const partners2 = await storage.getPartners();
      res.json(partners2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });
  app2.post("/api/admin/partners/:id/approve", async (req, res) => {
    try {
      const partnerId = req.params.id;
      const approvedBy = "admin";
      const partner = await storage.updatePartner(partnerId, {
        approvalStatus: "approved",
        approvedAt: /* @__PURE__ */ new Date(),
        approvedBy
      });
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      console.log(`\u{1F4E7} PARTNER APPROVAL EMAIL
To: ${partner.email}
Subject: Selling Partner Account Approved
Hi ${partner.firstName},
Your selling partner account has been approved! You can now log in and start posting properties.
Login at: /selling-partners
Best regards,
Investor Properties NY Team`);
      res.json({ message: "Partner approved successfully", partner });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve partner" });
    }
  });
  app2.post("/api/admin/partners/:id/reject", async (req, res) => {
    try {
      const partnerId = req.params.id;
      const { reason } = req.body;
      const partner = await storage.updatePartner(partnerId, {
        approvalStatus: "rejected",
        rejectionReason: reason || "Application did not meet requirements"
      });
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json({ message: "Partner rejected", partner });
    } catch (error) {
      res.status(500).json({ message: "Failed to reject partner" });
    }
  });

  // Admin login endpoint
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Authenticate admin user
      const adminUser = await storage.authenticateAdmin(username, password);
      
      if (adminUser) {
        // Set admin session
        req.session.adminId = adminUser.id;
        req.session.isAdmin = true;
        
        res.json({
          success: true,
          user: {
            id: adminUser.id,
            username: adminUser.username,
            role: "administrator"
          },
          message: "Login successful"
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: "Invalid admin credentials" 
        });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Login failed. Please try again." 
      });
    }
  });

  // Admin authentication check endpoint
  app2.get("/api/admin/me", async (req, res) => {
    try {
      // Check if admin is authenticated
      if (req.session.isAdmin && req.session.adminId) {
        // Get admin user details
        const adminUser = await storage.getUser(req.session.adminId);
        if (adminUser) {
          res.json({
            id: adminUser.id,
            username: adminUser.username,
            role: "administrator"
          });
        } else {
          // If user not found, clear session
          req.session.adminId = null;
          req.session.isAdmin = false;
          res.status(401).json({ message: "Invalid session" });
        }
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
    } catch (error) {
      console.error("Admin auth check error:", error);
      res.status(500).json({ message: "Authentication check failed" });
    }
  });

  // Admin logout endpoint
  app2.post("/api/admin/logout", async (req, res) => {
    try {
      // Clear admin session
      req.session.adminId = null;
      req.session.isAdmin = false;
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Blog API Routes
  app2.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getPublishedBlogs();
      res.json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app2.get("/api/blogs/:id", async (req, res) => {
    try {
      const blog = await storage.getBlog(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  app2.get("/api/blogs/slug/:slug", async (req, res) => {
    try {
      const blog = await storage.getBlogBySlug(req.params.slug);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json(blog);
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
/*
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
*/

function serveStatic(app2) {
  // Use the correct path resolution for ES modules
  const distPath = path2.resolve(import.meta.dirname, "public");
  console.log("import.meta.dirname:", import.meta.dirname);
  console.log("distPath:", distPath);
  console.log("distPath exists:", fs.existsSync(distPath));
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  
  // Serve static files with proper configuration
  app2.use(express.static(distPath, {
    index: 'index.html',
    maxAge: '1d'
  }));
  console.log("Static files served from:", distPath);
  
  // Admin routes - serve index.html for admin paths
  app2.get("/admin", (_req, res) => {
    console.log("Serving index.html for /admin");
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
  
  app2.get("/admin/login", (_req, res) => {
    console.log("Serving index.html for /admin/login");
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
  
  app2.get("/admin/*", (_req, res) => {
    console.log("Serving index.html for /admin/*");
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
  
  app2.use("*", (_req, res) => {
    console.log("Serving index.html for catch-all route");
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
const PgSession = pgSession(session);

app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: "user_sessions"
  }),
  secret: process.env.SESSION_SECRET || "your-secret-key-here",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  
  // Force production mode for static file serving
  serveStatic(app);
  
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen({
    port,
    host: "localhost",
    reusePort: false
  }, () => {
    log(`serving on port ${port}`);
  });
})();
