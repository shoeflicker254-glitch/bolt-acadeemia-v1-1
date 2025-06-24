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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_super_admins_updated_at ON super_admins;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;

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

-- Create the auth user for super admin
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'superadmin@acadeemia.com'
    ) THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'superadmin@acadeemia.com',
            crypt('Acadeemia@2025', gen_salt('bf')),
            now(),
            now(),
            now()
        );
    END IF;
END $$;

-- Insert super admin record
INSERT INTO super_admins (
    id,
    email,
    password_hash
)
SELECT 
    id,
    email,
    encrypted_password
FROM auth.users 
WHERE email = 'superadmin@acadeemia.com'
ON CONFLICT (email) DO NOTHING;

-- Drop existing policies if they exist
DO $$
BEGIN
    DROP POLICY IF EXISTS "Super admins can manage all schools" ON schools;
    DROP POLICY IF EXISTS "Super admins can manage all subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Super admins can manage all users" ON users;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

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