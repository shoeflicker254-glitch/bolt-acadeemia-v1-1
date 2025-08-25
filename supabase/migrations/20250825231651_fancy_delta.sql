/*
  # Create payments table for PesaPal integration

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `order_id` (text, unique)
      - `school_id` (uuid, foreign key to schools)
      - `amount` (numeric, payment amount)
      - `currency` (text, default 'KES')
      - `payment_method` (text, e.g., 'mpesa', 'card', 'bank')
      - `pesapal_tracking_id` (text, PesaPal order tracking ID)
      - `pesapal_transaction_id` (text, PesaPal transaction ID)
      - `status` (text, payment status)
      - `description` (text, payment description)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on payments table
    - Add policies for school admins and super admins

  3. Indexes
    - Add indexes for common queries
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  school_id uuid REFERENCES schools(id) NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'KES' NOT NULL,
  payment_method text NOT NULL,
  pesapal_tracking_id text,
  pesapal_transaction_id text,
  status text DEFAULT 'pending' NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints for valid values
ALTER TABLE payments 
ADD CONSTRAINT valid_payment_status 
CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded'));

ALTER TABLE payments 
ADD CONSTRAINT valid_payment_method 
CHECK (payment_method IN ('mpesa', 'card', 'bank', 'airtel', 'other'));

ALTER TABLE payments 
ADD CONSTRAINT valid_currency 
CHECK (currency IN ('KES', 'USD', 'EUR', 'GBP'));

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow super admins to manage all payments
CREATE POLICY "Super admins can manage all payments"
  ON payments
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

-- Allow school admins to view their school's payments
CREATE POLICY "School admins can view their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id 
      FROM users 
      WHERE users.id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow anonymous inserts for payment initiation
CREATE POLICY "Allow payment creation"
  ON payments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_school_id ON payments(school_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_pesapal_tracking_id ON payments(pesapal_tracking_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();