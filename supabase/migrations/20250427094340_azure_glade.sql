/*
  # Add Super Admin and Subscription Management

  1. New Tables
    - `super_admins`
      - `id` (uuid, primary key)
      - `email` (text)
      - `password_hash` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `subscriptions`
      - `id` (uuid, primary key)
      - `school_id` (uuid, foreign key)
      - `plan` (text)
      - `status` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for super admins
*/

-- Super Admins table
CREATE TABLE IF NOT EXISTS super_admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_super_admins_updated_at
    BEFORE UPDATE ON super_admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid REFERENCES schools(id) NOT NULL,
    plan text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    start_date date NOT NULL DEFAULT CURRENT_DATE,
    end_date date NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_plan CHECK (plan IN ('starter', 'professional', 'enterprise')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'expired', 'cancelled', 'pending'))
);

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Insert default super admin (password: Acadeemia@2025)
INSERT INTO super_admins (email, password_hash)
VALUES ('superadmin@acadeemia.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NRlaSL0xe')
ON CONFLICT (email) DO NOTHING;

-- Policies for super admins
CREATE POLICY "Super admins can manage all schools"
    ON schools
    FOR ALL
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM super_admins)
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM super_admins)
    );

CREATE POLICY "Super admins can manage all subscriptions"
    ON subscriptions
    FOR ALL
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM super_admins)
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM super_admins)
    );

-- Update users table to allow super admin management
CREATE POLICY "Super admins can manage all users"
    ON users
    FOR ALL
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM super_admins)
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM super_admins)
    );