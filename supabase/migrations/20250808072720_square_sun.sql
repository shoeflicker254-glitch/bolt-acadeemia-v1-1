/*
  # Create newsletter subscriptions table

  1. New Tables
    - `newsletter_subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text, optional)
      - `status` (text, default 'active')
      - `subscribed_at` (timestamp)
      - `unsubscribed_at` (timestamp, nullable)
      - `source` (text, default 'website')
      - `preferences` (jsonb, for future use)

  2. Security
    - Enable RLS on `newsletter_subscriptions` table
    - Add policy for anonymous users to subscribe
    - Add policy for super admins to manage subscriptions

  3. Indexes
    - Index on email for fast lookups
    - Index on status for filtering
    - Index on subscribed_at for sorting
*/

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  status text DEFAULT 'active' NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  source text DEFAULT 'website',
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints for valid status values
ALTER TABLE newsletter_subscriptions 
ADD CONSTRAINT valid_newsletter_status 
CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained'));

-- Add constraints for valid source values
ALTER TABLE newsletter_subscriptions 
ADD CONSTRAINT valid_newsletter_source 
CHECK (source IN ('website', 'admin', 'import', 'api'));

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to subscribe
CREATE POLICY "Allow anonymous newsletter subscriptions"
  ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow super admins to manage all newsletter subscriptions
CREATE POLICY "Super admins can manage newsletter subscriptions"
  ON newsletter_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE super_admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM super_admins 
      WHERE super_admins.id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_source ON newsletter_subscriptions(source);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();