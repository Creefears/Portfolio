/*
  # Create roles table and policies

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text, optional)
      - `icon` (text)
      - `color` (text)
      - `permissions` (jsonb, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `roles` table
    - Add policy for public access
    - Add trigger for updated_at timestamp
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text NOT NULL,
  color text NOT NULL,
  permissions jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Allow all operations for everyone on roles" ON roles;

-- Create policy for public access
CREATE POLICY "Allow all operations for everyone on roles"
  ON roles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();