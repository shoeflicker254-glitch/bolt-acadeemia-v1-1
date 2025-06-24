/*
  # Fix Super Admin and Subscription Management

  1. Updates
    - Drop and recreate triggers
    - Create auth user for super admin
    - Insert super admin record
    - Update policies

  2. Security
    - Maintain RLS policies
    - Fix super admin access
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_super_admins_updated_at ON super_admins;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;

-- Recreate triggers
CREATE TRIGGER update_super_admins_updated_at
    BEFORE UPDATE ON super_admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create the auth user for super admin if not exists
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

-- Recreate policies for super admins
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