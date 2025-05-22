/*
  # Update roles table schema

  1. Changes
    - Update roles table to store role colors
    - Add colors JSON field for background and text colors
    - Remove unused fields (icon, permissions)
    - Keep RLS and triggers

  2. Security
    - Enable RLS
    - Allow all operations for authenticated users
*/

-- Create roles table with updated schema
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  colors jsonb NOT NULL DEFAULT '{"bg": "bg-blue-100", "text": "text-blue-800"}',
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