/*
  # Remove authentication requirements from tables

  1. Changes
    - Drop existing RLS policies
    - Create new policies that allow public access for all operations
    - Keep RLS enabled but make it permissive for all users
  
  2. Security Note
    - This configuration allows anyone to modify data
    - Only use in development/testing environments
*/

-- Projects table policies
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON projects;

CREATE POLICY "Allow all operations for everyone on projects"
ON projects FOR ALL
USING (true)
WITH CHECK (true);

-- Experiences table policies
DROP POLICY IF EXISTS "Anyone can view experiences" ON experiences;
DROP POLICY IF EXISTS "Authenticated users can insert experiences" ON experiences;
DROP POLICY IF EXISTS "Authenticated users can update their experiences" ON experiences;
DROP POLICY IF EXISTS "Authenticated users can delete their experiences" ON experiences;

CREATE POLICY "Allow all operations for everyone on experiences"
ON experiences FOR ALL
USING (true)
WITH CHECK (true);

-- User roles table policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can manage user roles" ON user_roles;

CREATE POLICY "Allow all operations for everyone on user_roles"
ON user_roles FOR ALL
USING (true)
WITH CHECK (true);

-- User badges table policies
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
DROP POLICY IF EXISTS "Authenticated users can manage user badges" ON user_badges;

CREATE POLICY "Allow all operations for everyone on user_badges"
ON user_badges FOR ALL
USING (true)
WITH CHECK (true);

-- Badges table policies
DROP POLICY IF EXISTS "Anyone can view badges" ON badges;
DROP POLICY IF EXISTS "Authenticated users can manage badges" ON badges;

CREATE POLICY "Allow all operations for everyone on badges"
ON badges FOR ALL
USING (true)
WITH CHECK (true);

-- Roles table policies
DROP POLICY IF EXISTS "Anyone can view roles" ON roles;
DROP POLICY IF EXISTS "Authenticated users can manage roles" ON roles;

CREATE POLICY "Allow all operations for everyone on roles"
ON roles FOR ALL
USING (true)
WITH CHECK (true);

-- Deployments table policies
DROP POLICY IF EXISTS "Anyone can view deployments" ON deployments;
DROP POLICY IF EXISTS "Authenticated users can manage deployments" ON deployments;

CREATE POLICY "Allow all operations for everyone on deployments"
ON deployments FOR ALL
USING (true)
WITH CHECK (true);