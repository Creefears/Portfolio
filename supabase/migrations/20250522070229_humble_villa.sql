/*
  # Create roles management system
  
  1. New Tables
    - `roles` table for storing user roles
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text, optional)
      - `color` (text)
      - `permissions` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on roles table
    - Add policy for authenticated users to read roles
    - Add policy for admins to modify roles
    
  3. Triggers
    - Add trigger for updating updated_at timestamp
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  color text NOT NULL,
  permissions jsonb DEFAULT '{"create": false, "read": true, "update": false, "delete": false, "admin": false}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' 
    AND policyname = 'Authenticated users can read roles'
  ) THEN
    CREATE POLICY "Authenticated users can read roles"
      ON roles
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' 
    AND policyname = 'Only admins can modify roles'
  ) THEN
    CREATE POLICY "Only admins can modify roles"
      ON roles
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin')
      WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;

-- Add trigger for updating updated_at timestamp
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_roles_updated_at'
  ) THEN
    CREATE TRIGGER update_roles_updated_at
      BEFORE UPDATE ON roles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;