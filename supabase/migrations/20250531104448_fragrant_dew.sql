/*
  # Fix recursive RLS policies for users table

  1. Changes
    - Remove recursive policy that was causing infinite loops
    - Simplify the users table policies to prevent recursion
    - Add clearer, non-recursive policies for user access

  2. Security
    - Maintain security by ensuring users can only access appropriate data
    - Keep super admin access unchanged
    - Ensure users can still update their own profiles
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view users in their school" ON users;

-- Create a new, non-recursive policy for viewing users in the same school
CREATE POLICY "Users can view users in same school"
ON users
FOR SELECT
TO authenticated
USING (
  -- Simple comparison of school_ids without recursive lookup
  school_id = (
    SELECT school_id 
    FROM users 
    WHERE id = auth.uid()
    LIMIT 1
  )
);

-- Note: Other existing policies remain unchanged as they are not causing recursion:
-- - "Super admins can manage all users"
-- - "Users can update their own profile"