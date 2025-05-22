/*
  # Remove authentication requirements from tables

  1. Changes
    - Drop existing policies if they exist
    - Create new policies that allow all operations for everyone
    - Keep RLS enabled but make it permissive for all users
  
  2. Security Note
    - This configuration allows anyone to modify data
    - Only use in development/testing environments
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
  DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;
  DROP POLICY IF EXISTS "Allow public read access to project_tools" ON project_tools;
  DROP POLICY IF EXISTS "Allow authenticated users to manage project_tools" ON project_tools;
  DROP POLICY IF EXISTS "Allow public read access to projects" ON projects;
  DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;
  DROP POLICY IF EXISTS "Allow public read access to experiences" ON experiences;
  DROP POLICY IF EXISTS "Allow authenticated users to manage experiences" ON experiences;
  DROP POLICY IF EXISTS "Allow all operations for everyone on projects" ON projects;
  DROP POLICY IF EXISTS "Allow all operations for everyone on tools" ON tools;
  DROP POLICY IF EXISTS "Allow all operations for everyone on project_tools" ON project_tools;
  DROP POLICY IF EXISTS "Allow all operations for everyone on experiences" ON experiences;
END $$;

-- Create new permissive policies for tools
CREATE POLICY "Allow all operations for everyone on tools"
ON tools FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create new permissive policies for project_tools
CREATE POLICY "Allow all operations for everyone on project_tools"
ON project_tools FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create new permissive policies for projects
CREATE POLICY "Allow all operations for everyone on projects"
ON projects FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create new permissive policies for experiences
CREATE POLICY "Allow all operations for everyone on experiences"
ON experiences FOR ALL
TO public
USING (true)
WITH CHECK (true);