/*
  # Create Forms Management Tables

  1. New Tables
    - `demo_requests`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, optional)
      - `institution` (text, required)
      - `role` (text, required)
      - `version` (text, required)
      - `message` (text, optional)
      - `calendly_url` (text, optional)
      - `created_at` (timestamp)

    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text, required)
      - `message` (text, required)
      - `created_at` (timestamp)

    - `email_support_requests`
      - `id` (uuid, primary key)
      - `sender_name` (text, required)
      - `sender_email` (text, required)
      - `subject` (text, required)
      - `support_type` (text, required)
      - `message` (text, required)
      - `ticket_number` (text, unique)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous inserts (forms)
    - Add policies for super admin access (dashboard)

  3. Indexes
    - Add indexes for email fields for faster searching
    - Add indexes for created_at for date filtering
    - Add index for ticket_number for support requests
*/

-- Demo Requests Table
CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  institution text NOT NULL,
  role text NOT NULL,
  version text NOT NULL,
  message text,
  calendly_url text,
  created_at timestamptz DEFAULT now()
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Email Support Requests Table
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

-- Add constraints for valid values
ALTER TABLE email_support_requests 
ADD CONSTRAINT IF NOT EXISTS valid_support_status 
CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed'));

ALTER TABLE email_support_requests 
ADD CONSTRAINT IF NOT EXISTS valid_support_type 
CHECK (support_type IN ('Technical Issue', 'Billing Question', 'Feature Request', 'Bug Report', 'Account Access', 'Training Support', 'General Inquiry', 'Other'));

-- Enable Row Level Security
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_support_requests ENABLE ROW LEVEL SECURITY;

-- Policies for demo_requests
CREATE POLICY "Allow anonymous inserts to demo_requests"
  ON demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow super_admins to view demo_requests"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Allow super_admins to delete demo_requests"
  ON demo_requests
  FOR DELETE
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins));

-- Policies for contacts
CREATE POLICY "Allow anonymous inserts to contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow super_admins to view contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Allow super_admins to delete contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins));

-- Policies for email_support_requests
CREATE POLICY "Allow anonymous inserts to email_support_requests"
  ON email_support_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow super_admins to view email_support_requests"
  ON email_support_requests
  FOR SELECT
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Super admins can view all email support requests"
  ON email_support_requests
  FOR SELECT
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Allow super_admins to delete email_support_requests"
  ON email_support_requests
  FOR DELETE
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins));

CREATE POLICY "Allow super_admins to update email_support_requests"
  ON email_support_requests
  FOR UPDATE
  TO authenticated
  USING (uid() IN (SELECT id FROM super_admins))
  WITH CHECK (uid() IN (SELECT id FROM super_admins));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email);
CREATE INDEX IF NOT EXISTS idx_demo_created_at ON demo_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

CREATE INDEX IF NOT EXISTS idx_email_support_email ON email_support_requests(sender_email);
CREATE INDEX IF NOT EXISTS idx_email_support_created_at ON email_support_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_email_support_status ON email_support_requests(status);
CREATE INDEX IF NOT EXISTS idx_email_support_ticket_number ON email_support_requests(ticket_number);