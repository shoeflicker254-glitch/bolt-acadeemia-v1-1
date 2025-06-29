/*
  # Create email support requests table if not exists

  1. New Tables
    - `email_support_requests`
      - `id` (uuid, primary key)
      - `sender_name` (text, required)
      - `sender_email` (text, required)
      - `subject` (text, required)
      - `support_type` (text, required with constraints)
      - `message` (text, required)
      - `ticket_number` (text, unique, required)
      - `status` (text, default 'pending' with constraints)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `email_support_requests` table
    - Add policy for anonymous inserts
    - Add policy for super admins to view all requests

  3. Indexes
    - Index on created_at for sorting
    - Index on sender_email for filtering
    - Index on status for filtering
    - Index on ticket_number for quick lookups
*/

-- Create email_support_requests table only if it doesn't exist
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

-- Add constraints only if they don't exist
DO $$
BEGIN
  -- Check if valid_support_type constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'email_support_requests' 
    AND constraint_name = 'valid_support_type'
  ) THEN
    ALTER TABLE email_support_requests 
    ADD CONSTRAINT valid_support_type 
    CHECK (support_type = ANY (ARRAY[
      'Technical Issue'::text, 
      'Billing Question'::text, 
      'Feature Request'::text, 
      'Bug Report'::text, 
      'Account Access'::text, 
      'Training Support'::text, 
      'General Inquiry'::text, 
      'Other'::text
    ]));
  END IF;

  -- Check if valid_support_status constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'email_support_requests' 
    AND constraint_name = 'valid_support_status'
  ) THEN
    ALTER TABLE email_support_requests 
    ADD CONSTRAINT valid_support_status 
    CHECK (status = ANY (ARRAY[
      'pending'::text, 
      'in_progress'::text, 
      'resolved'::text, 
      'closed'::text
    ]));
  END IF;
END $$;

-- Enable RLS only if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'email_support_requests'
    AND n.nspname = 'public'
    AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE email_support_requests ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_email_support_created_at ON email_support_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_email_support_email ON email_support_requests(sender_email);
CREATE INDEX IF NOT EXISTS idx_email_support_status ON email_support_requests(status);
CREATE INDEX IF NOT EXISTS idx_email_support_ticket_number ON email_support_requests(ticket_number);

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Policy for anonymous inserts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'email_support_requests' 
    AND policyname = 'Allow anonymous inserts to email_support_requests'
  ) THEN
    CREATE POLICY "Allow anonymous inserts to email_support_requests"
      ON email_support_requests
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;

  -- Policy for super admin access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'email_support_requests' 
    AND policyname = 'Super admins can view all email support requests'
  ) THEN
    CREATE POLICY "Super admins can view all email support requests"
      ON email_support_requests
      FOR SELECT
      TO authenticated
      USING (auth.uid() IN (SELECT id FROM super_admins));
  END IF;
END $$;