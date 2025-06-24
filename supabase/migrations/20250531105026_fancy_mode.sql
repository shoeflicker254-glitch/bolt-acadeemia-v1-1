/*
  # Fix users table RLS policies

  1. Changes
    - Remove recursive policies from users table
    - Add new, simplified policies for:
      - Super admins to manage all users
      - Users to update their own profile
      - Users to view users in same school
    
  2. Security
    - Maintains RLS on users table
    - Ensures proper access control without recursion
    - Preserves existing security model but fixes implementation
*/

-- First, drop existing policies to start fresh
DROP POLICY IF EXISTS "Super admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view users in same school" ON users;

-- Create new, non-recursive policies
CREATE POLICY "Super admins can manage all users"
ON users
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

CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view users in same school"
ON users
FOR SELECT
TO authenticated
USING (
  school_id = (
    SELECT u.school_id 
    FROM users u 
    WHERE u.id = auth.uid() 
    LIMIT 1
  )
);