/*
  # Update tools table schema

  1. Changes
    - Remove description and category columns
    - Keep only essential columns: id, name, icon, color
  
  2. Security
    - Maintain existing RLS policies
*/

-- Remove unnecessary columns
ALTER TABLE tools 
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS category;

-- Ensure we have the correct columns and constraints
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure RLS is enabled
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;

CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage tools"
  ON tools FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);