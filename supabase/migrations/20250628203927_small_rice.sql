/*
  # Add email support requests table

  1. New Tables
    - `email_support_requests`
      - `id` (uuid, primary key)
      - `sender_name` (text)
      - `sender_email` (text)
      - `subject` (text)
      - `support_type` (text)
      - `message` (text)
      - `ticket_number` (text, unique)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on email_support_requests table
    - Add policy for anonymous inserts
    - Add policy for super admins to view all requests

  3. Performance
    - Add indexes for common queries
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
  USING (auth.uid() IN (SELECT id FROM super_admins));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_support_ticket_number ON email_support_requests(ticket_number);
CREATE INDEX IF NOT EXISTS idx_email_support_created_at ON email_support_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_email_support_status ON email_support_requests(status);
CREATE INDEX IF NOT EXISTS idx_email_support_email ON email_support_requests(sender_email);

-- Add constraint for valid status values
ALTER TABLE email_support_requests 
ADD CONSTRAINT valid_support_status 
CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed'));

-- Add constraint for valid support types
ALTER TABLE email_support_requests 
ADD CONSTRAINT valid_support_type 
CHECK (support_type IN ('Technical Issue', 'Billing Question', 'Feature Request', 'Bug Report', 'Account Access', 'Training Support', 'General Inquiry', 'Other'));