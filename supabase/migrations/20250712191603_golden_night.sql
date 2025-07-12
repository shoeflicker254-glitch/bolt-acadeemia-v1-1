/*
  # Ensure Super Admin Privileges

  1. Updates
    - Ensure both registered accounts have super_admin role
    - Update users table to reflect super_admin role
    - Add any missing super_admin entries

  2. Security
    - Maintain existing RLS policies
    - Ensure proper role assignment
*/

-- First, ensure the super_admins table has the role column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'super_admins' AND column_name = 'role'
  ) THEN
    ALTER TABLE super_admins ADD COLUMN role text DEFAULT 'super_admin';
  END IF;
END $$;

-- Update existing super admin accounts to ensure they have the correct role
UPDATE super_admins 
SET role = 'super_admin' 
WHERE role IS NULL OR role != 'super_admin';

-- Ensure both demo accounts exist in super_admins table
INSERT INTO super_admins (id, email, password_hash, role, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(encrypted_password, crypt('DemoAdmin2025!', gen_salt('bf'))),
  'super_admin',
  COALESCE(created_at, now()),
  now()
FROM auth.users 
WHERE email IN ('demo@acadeemia.com', 'superadmin@acadeemia.com')
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  updated_at = now();

-- Ensure both accounts exist in the users table with super_admin role
INSERT INTO users (id, email, role, created_at, updated_at)
SELECT 
  id,
  email,
  'super_admin',
  COALESCE(created_at, now()),
  now()
FROM auth.users 
WHERE email IN ('demo@acadeemia.com', 'superadmin@acadeemia.com')
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  updated_at = now();

-- Create auth.users entries if they don't exist (for demo purposes)
DO $$
DECLARE
  demo_user_id uuid;
  super_user_id uuid;
BEGIN
  -- Check if demo@acadeemia.com exists
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@acadeemia.com';
  
  IF demo_user_id IS NULL THEN
    demo_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      demo_user_id,
      '00000000-0000-0000-0000-000000000000',
      'demo@acadeemia.com',
      crypt('DemoAdmin2025!', gen_salt('bf')),
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated',
      '',
      '',
      ''
    );
    
    -- Add to super_admins
    INSERT INTO super_admins (id, email, password_hash, role, created_at, updated_at)
    VALUES (demo_user_id, 'demo@acadeemia.com', crypt('DemoAdmin2025!', gen_salt('bf')), 'super_admin', now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Add to users
    INSERT INTO users (id, email, role, created_at, updated_at)
    VALUES (demo_user_id, 'demo@acadeemia.com', 'super_admin', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Check if superadmin@acadeemia.com exists
  SELECT id INTO super_user_id FROM auth.users WHERE email = 'superadmin@acadeemia.com';
  
  IF super_user_id IS NULL THEN
    super_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      super_user_id,
      '00000000-0000-0000-0000-000000000000',
      'superadmin@acadeemia.com',
      crypt('Acadeemia@2025', gen_salt('bf')),
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated',
      '',
      '',
      ''
    );
    
    -- Add to super_admins
    INSERT INTO super_admins (id, email, password_hash, role, created_at, updated_at)
    VALUES (super_user_id, 'superadmin@acadeemia.com', crypt('Acadeemia@2025', gen_salt('bf')), 'super_admin', now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Add to users
    INSERT INTO users (id, email, role, created_at, updated_at)
    VALUES (super_user_id, 'superadmin@acadeemia.com', 'super_admin', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;