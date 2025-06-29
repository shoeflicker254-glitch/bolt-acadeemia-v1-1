/*
  # Email Support Requests Table

  1. New Tables
    - `email_support_requests`
      - `id` (uuid, primary key)
      - `sender_name` (text, required)
      - `sender_email` (text, required)
      - `subject` (text, required)
      - `support_type` (text, required)
      - `message` (text, required)
      - `ticket_number` (text, unique, required)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `email_support_requests` table
    - Add policy for anonymous users to insert support requests
    - Add policy for super admins to view all support requests

  3. Performance
    - Add indexes for ticket_number, created_at, status, and sender_email

  4. Constraints
    - Valid status values constraint
    - Valid support type values constraint
*/

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

ALTER TABLE email_support_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts to email_support_requests" ON email_support_requests;
DROP POLICY IF EXISTS "Super admins can view all email support requests" ON email_support_requests;

-- Allow anonymous users to insert support requests
CREATE POLICY "Allow anonymous inserts to email_support_requests"
  ON email_support_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow super admins to view all support requests
CREATE POLICY "Super admins can view all email support requests"
  ON email_support_requests
  FOR SELECT
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_support_ticket_number ON email_support_requests(ticket_number);
CREATE INDEX IF NOT EXISTS idx_email_support_created_at ON email_support_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_email_support_status ON email_support_requests(status);
CREATE INDEX IF NOT EXISTS idx_email_support_email ON email_support_requests(sender_email);

-- Add constraints for valid values (use DO block to handle existing constraints)
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