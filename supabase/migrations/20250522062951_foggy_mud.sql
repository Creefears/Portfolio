/*
  # Create roles table

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `permissions` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for public access
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

-- Create policy for public access
CREATE POLICY "Allow all operations for everyone on roles"
  ON roles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();