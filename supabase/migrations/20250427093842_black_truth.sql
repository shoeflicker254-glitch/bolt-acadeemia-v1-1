/*
  # Initial Schema Setup for Acadeemia

  1. New Tables
    - `schools`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `phone` (text)
      - `email` (text)
      - `website` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `users`
      - `id` (uuid, primary key, linked to auth.users)
      - `email` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `role` (text)
      - `school_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `students`
      - `id` (uuid, primary key)
      - `admission_number` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `school_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `classes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `school_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their school's data
*/

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    address text,
    phone text,
    email text,
    website text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    role text NOT NULL DEFAULT 'user',
    school_id uuid REFERENCES schools(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_role CHECK (role IN ('admin', 'teacher', 'staff', 'user'))
);

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_number text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    date_of_birth date,
    gender text,
    school_id uuid REFERENCES schools(id) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_admission_number_per_school UNIQUE (admission_number, school_id)
);

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    school_id uuid REFERENCES schools(id) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_class_name_per_school UNIQUE (name, school_id)
);

CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Policies for schools
CREATE POLICY "Users can view their school"
    ON schools
    FOR SELECT
    TO authenticated
    USING (id IN (
        SELECT school_id 
        FROM users 
        WHERE users.id = auth.uid()
    ));

-- Policies for users
CREATE POLICY "Users can view users in their school"
    ON users
    FOR SELECT
    TO authenticated
    USING (school_id IN (
        SELECT school_id 
        FROM users 
        WHERE users.id = auth.uid()
    ));

CREATE POLICY "Users can update their own profile"
    ON users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Policies for students
CREATE POLICY "Users can view students in their school"
    ON students
    FOR SELECT
    TO authenticated
    USING (school_id IN (
        SELECT school_id 
        FROM users 
        WHERE users.id = auth.uid()
    ));

CREATE POLICY "Staff can manage students in their school"
    ON students
    FOR ALL
    TO authenticated
    USING (
        school_id IN (
            SELECT school_id 
            FROM users 
            WHERE users.id = auth.uid() 
            AND role IN ('admin', 'teacher', 'staff')
        )
    )
    WITH CHECK (
        school_id IN (
            SELECT school_id 
            FROM users 
            WHERE users.id = auth.uid() 
            AND role IN ('admin', 'teacher', 'staff')
        )
    );

-- Policies for classes
CREATE POLICY "Users can view classes in their school"
    ON classes
    FOR SELECT
    TO authenticated
    USING (school_id IN (
        SELECT school_id 
        FROM users 
        WHERE users.id = auth.uid()
    ));

CREATE POLICY "Staff can manage classes in their school"
    ON classes
    FOR ALL
    TO authenticated
    USING (
        school_id IN (
            SELECT school_id 
            FROM users 
            WHERE users.id = auth.uid() 
            AND role IN ('admin', 'teacher', 'staff')
        )
    )
    WITH CHECK (
        school_id IN (
            SELECT school_id 
            FROM users 
            WHERE users.id = auth.uid() 
            AND role IN ('admin', 'teacher', 'staff')
        )
    );