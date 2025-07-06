/*
  # Fix Email Support Requests Table

  1. Ensure email_support_requests table exists with proper structure
  2. Add proper RLS policies
  3. Add necessary indexes
  4. Add constraints for data validation

  This migration is idempotent and safe to run multiple times.
*/

-- Create email_support_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  subject text NOT NULL,
  support_type text NOT NULL,
  message text NOT NULL,
  ticket_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_support_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts to email_support_requests" ON email_support_requests;
DROP POLICY IF EXISTS "Super admins can view all email support requests" ON email_support_requests;

-- Create policies
CREATE POLICY "Allow anonymous inserts to email_support_requests"
  ON email_support_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Super admins can view all email support requests"
  ON email_support_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM super_admins));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_support_ticket_number ON email_support_requests(ticket_number);
CREATE INDEX IF NOT EXISTS idx_email_support_created_at ON email_support_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_email_support_status ON email_support_requests(status);
CREATE INDEX IF NOT EXISTS idx_email_support_email ON email_support_requests(sender_email);

-- Add constraints
DO $$
BEGIN
  -- Add status constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_support_status' 
    AND table_name = 'email_support_requests'
  ) THEN
    ALTER TABLE email_support_requests 
    ADD CONSTRAINT valid_support_status 
    CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed'));
  END IF;

  -- Add support type constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_support_type' 
    AND table_name = 'email_support_requests'
  ) THEN
    ALTER TABLE email_support_requests 
    ADD CONSTRAINT valid_support_type 
    CHECK (support_type IN ('Technical Issue', 'Billing Question', 'Feature Request', 'Bug Report', 'Account Access', 'Training Support', 'General Inquiry', 'Other'));
  END IF;
END $$;