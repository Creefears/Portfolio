/*
  # Fix Projects Table RLS Policies

  1. Changes
    - Drop existing RLS policies for projects table
    - Create new RLS policies with proper authentication checks
    - Ensure authenticated users can perform CRUD operations
    - Allow public read access

  2. Security
    - Enable RLS on projects table
    - Add policies for:
      - Public read access
      - Authenticated user insert
      - Authenticated user update
      - Authenticated user delete
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON projects;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON projects FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update access for authenticated users"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete access for authenticated users"
ON projects FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);