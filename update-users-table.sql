-- Comprehensive update script for users table
-- This script safely adds all required columns to the users table

-- First, check current table structure
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position;

-- Add columns one by one with proper handling
DO $$ 
BEGIN
  -- Add email column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email') THEN
    ALTER TABLE users ADD COLUMN email TEXT;
  END IF;
  
  -- Add first_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'first_name') THEN
    ALTER TABLE users ADD COLUMN first_name TEXT;
  END IF;
  
  -- Add last_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_name') THEN
    ALTER TABLE users ADD COLUMN last_name TEXT;
  END IF;
  
  -- Add phone column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
    ALTER TABLE users ADD COLUMN phone TEXT;
  END IF;
  
  -- Add email_verified column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified') THEN
    ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;
  
  -- Add email_verification_token column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verification_token') THEN
    ALTER TABLE users ADD COLUMN email_verification_token TEXT;
  END IF;
  
  -- Add email_verification_sent_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verification_sent_at') THEN
    ALTER TABLE users ADD COLUMN email_verification_sent_at TIMESTAMP;
  END IF;
  
  -- Add email_verified_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified_at') THEN
    ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP;
  END IF;
  
  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
    ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
  END IF;
  
  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
  END IF;
END $$;

-- Update users table schema to add missing authentication columns
-- This script handles the case where the users table exists with only username and password columns

-- First, add all new columns with default values to avoid NULL constraint violations
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'temp@example.com',
ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT 'Temp',
ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT 'User',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verification_sent_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Update existing rows to set meaningful values based on username
-- This avoids keeping the temporary default values
UPDATE users 
SET 
  email = username || '@investorpropertiesny.com',
  first_name = INITCAP(SPLIT_PART(username, '_', 1)),
  last_name = CASE 
    WHEN POSITION('_' IN username) > 0 THEN INITCAP(SUBSTRING(username FROM POSITION('_' IN username) + 1))
    ELSE 'User'
  END,
  email_verified = false,
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW())
WHERE 
  email = 'temp@example.com' 
  OR first_name = 'Temp' 
  OR last_name = 'User';

-- Remove the default values to prevent future issues
ALTER TABLE users ALTER COLUMN email DROP DEFAULT;
ALTER TABLE users ALTER COLUMN first_name DROP DEFAULT;
ALTER TABLE users ALTER COLUMN last_name DROP DEFAULT;
ALTER TABLE users ALTER COLUMN email_verified DROP DEFAULT;
ALTER TABLE users ALTER COLUMN created_at DROP DEFAULT;
ALTER TABLE users ALTER COLUMN updated_at DROP DEFAULT;

-- Now that all rows have values, we can safely add NOT NULL constraints
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN email_verified SET NOT NULL;
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;

-- Update existing rows to ensure no NULL values for columns that will become NOT NULL
UPDATE users 
SET 
  email = COALESCE(email, username || '@example.com'),
  first_name = COALESCE(first_name, 'User'),
  last_name = COALESCE(last_name, username),
  email_verified = COALESCE(email_verified, false),
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW())
WHERE 
  email IS NULL 
  OR first_name IS NULL 
  OR last_name IS NULL 
  OR email_verified IS NULL 
  OR created_at IS NULL 
  OR updated_at IS NULL;

-- Add NOT NULL constraints one by one with safety checks
DO $$ 
BEGIN
  -- Add NOT NULL constraint for email if all rows have non-null values
  IF NOT EXISTS (SELECT 1 FROM users WHERE email IS NULL) THEN
    ALTER TABLE users ALTER COLUMN email SET NOT NULL;
  ELSE
    RAISE NOTICE 'Skipping NOT NULL constraint for email due to existing NULL values';
  END IF;
  
  -- Add NOT NULL constraint for first_name if all rows have non-null values
  IF NOT EXISTS (SELECT 1 FROM users WHERE first_name IS NULL) THEN
    ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
  ELSE
    RAISE NOTICE 'Skipping NOT NULL constraint for first_name due to existing NULL values';
  END IF;
  
  -- Add NOT NULL constraint for last_name if all rows have non-null values
  IF NOT EXISTS (SELECT 1 FROM users WHERE last_name IS NULL) THEN
    ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
  ELSE
    RAISE NOTICE 'Skipping NOT NULL constraint for last_name due to existing NULL values';
  END IF;
  
  -- Add NOT NULL constraint for email_verified if all rows have non-null values
  IF NOT EXISTS (SELECT 1 FROM users WHERE email_verified IS NULL) THEN
    ALTER TABLE users ALTER COLUMN email_verified SET NOT NULL;
  ELSE
    RAISE NOTICE 'Skipping NOT NULL constraint for email_verified due to existing NULL values';
  END IF;
  
  -- Add NOT NULL constraint for created_at if all rows have non-null values
  IF NOT EXISTS (SELECT 1 FROM users WHERE created_at IS NULL) THEN
    ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
  ELSE
    RAISE NOTICE 'Skipping NOT NULL constraint for created_at due to existing NULL values';
  END IF;
  
  -- Add NOT NULL constraint for updated_at if all rows have non-null values
  IF NOT EXISTS (SELECT 1 FROM users WHERE updated_at IS NULL) THEN
    ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
  ELSE
    RAISE NOTICE 'Skipping NOT NULL constraint for updated_at due to existing NULL values';
  END IF;
END $$;