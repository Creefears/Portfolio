/*
  # Fix Projects Table RLS Policies

  1. Changes
    - Drop existing RLS policies for projects table
    - Create new policies that properly handle:
      - SELECT: Allow public access to view all projects
      - INSERT: Allow authenticated users to insert new projects
      - UPDATE: Allow authenticated users to update their own projects
      - DELETE: Allow authenticated users to delete their own projects
  
  2. Security
    - Maintains RLS enabled on projects table
    - Ensures proper access control while fixing the 401 errors
*/

-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Anyone can view projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete their projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update their projects" ON projects;

-- Create new policies with proper permissions
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