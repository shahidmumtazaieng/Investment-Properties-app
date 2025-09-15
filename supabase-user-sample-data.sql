-- Insert sample users for testing
INSERT INTO users (id, username, password, email, first_name, last_name, phone, email_verified, email_verification_token, email_verification_sent_at, email_verified_at, created_at, updated_at) VALUES
('user-1', 'john_doe', 'password123', 'john.doe@example.com', 'John', 'Doe', '555-1234', true, null, null, NOW(), NOW(), NOW()),
('user-2', 'jane_smith', 'password456', 'jane.smith@example.com', 'Jane', 'Smith', '555-5678', true, null, null, NOW(), NOW(), NOW()),
('user-3', 'bob_johnson', 'password789', 'bob.johnson@example.com', 'Bob', 'Johnson', '555-9012', false, 'abc123token', NOW(), null, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample properties for testing offers
INSERT INTO properties (id, address, neighborhood, borough, property_type, beds, baths, sqft, units, price, arv, estimated_profit, cap_rate, annual_income, condition, access, images, description, google_sheets_row_id, partner_id, source, status, is_active, created_at, updated_at) VALUES
('prop-1', '123 Main St', 'Downtown', 'Manhattan', 'Apartment', 2, 1, 1000, 1, 500000, 600000, 75000, 8.5, 45000, 'Good', 'Available with Appointment', ARRAY['https://example.com/image1.jpg'], 'Beautiful downtown apartment', null, null, 'internal', 'available', true, NOW(), NOW()),
('prop-2', '456 Park Ave', 'Midtown', 'Manhattan', 'Condo', 3, 2, 1500, 1, 750000, 850000, 100000, 9.2, 65000, 'Excellent', 'Available with Appointment', ARRAY['https://example.com/image2.jpg'], 'Luxury condo with city views', null, null, 'internal', 'available', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample leads for testing
INSERT INTO leads (id, type, name, email, phone, source, status, motivation, timeline, budget, preferred_areas, experience_level, property_details, notes, email_verified, email_verification_token, email_verification_sent_at, email_verified_at, phone_verified, phone_verification_code, phone_verification_sent_at, phone_verified_at, created_at, updated_at) VALUES
('lead-1', 'buyer', 'John Doe', 'john.doe@example.com', '555-1234', 'website_form', 'new', 'Investment', '3-6 months', '$500K-$700K', ARRAY['Manhattan', 'Brooklyn'], 'Experienced', null, 'Interested in downtown properties', true, null, null, NOW(), true, null, null, NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample offers for testing
INSERT INTO offers (id, property_id, buyer_lead_id, offer_amount, terms, status, offer_letter_url, proof_of_funds_url, closing_date, down_payment, financing_type, contingencies, additional_terms, signed_at, created_at, updated_at) VALUES
('offer-1', 'prop-1', 'lead-1', 480000, 'All cash offer', 'pending', null, null, '2023-12-01', 96000, 'cash', 'None', 'Flexible closing', null, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;