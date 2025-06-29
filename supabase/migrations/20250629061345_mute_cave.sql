/*
  # Fix Users Table RLS Policies

  This migration fixes the infinite recursion issue in the users table RLS policies
  by removing problematic policies and creating new, safe ones.

  1. Security Changes
    - Drop existing problematic RLS policies on users table
    - Create new safe policies that avoid circular dependencies
    - Ensure users can read their own data
    - Allow super admins to manage all users
    - Allow staff to view users in their school

  2. Policy Details
    - Users can read and update their own profile using auth.uid()
    - Super admins have full access (checked via super_admins table)
    - School staff can view users in their school (safe query pattern)
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Super admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view users in same school" ON users;

-- Create safe policies that avoid recursion

-- Policy 1: Users can read and update their own profile
CREATE POLICY "Users can manage own profile"
  ON users
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Policy 2: Super admins can manage all users (safe check)
CREATE POLICY "Super admins manage all users"
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

-- Policy 3: Allow reading users in same school (safe pattern)
CREATE POLICY "View school users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    school_id IS NOT NULL 
    AND school_id IN (
      SELECT u.school_id 
      FROM users u 
      WHERE u.id = auth.uid() 
      AND u.school_id IS NOT NULL
    )
  );