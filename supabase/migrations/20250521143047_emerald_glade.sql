/*
  # Tools and Project Tools Setup

  1. New Tables
    - Recreates `tools` table with proper structure
    - Recreates `project_tools` junction table
  
  2. Security
    - Enables RLS on both tables
    - Sets up proper access policies
    
  3. Data
    - Inserts default tools
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow public access to tools" ON tools;
DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;
DROP POLICY IF EXISTS "Allow public access to project_tools" ON project_tools;
DROP POLICY IF EXISTS "Allow public read access to project_tools" ON project_tools;

-- Drop and recreate tools table with CASCADE to handle dependencies
DROP TABLE IF EXISTS tools CASCADE;
CREATE TABLE tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  short_name text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage tools"
  ON tools FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure updated_at trigger exists
DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Recreate project_tools table and its foreign key
DROP TABLE IF EXISTS project_tools CASCADE;
CREATE TABLE project_tools (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tool_id)
);

-- Enable RLS on project_tools
ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;

-- Create policies for project_tools
CREATE POLICY "Allow public read access to project_tools"
  ON project_tools FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage project_tools"
  ON project_tools FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default tools
INSERT INTO tools (name, short_name, icon, color) VALUES
  ('Blender', 'Blender', 'Box', '#EA7600'),
  ('Unity', 'Unity', 'Gamepad2', '#4C9EDE'),
  ('Unreal Engine 5', 'UE5', 'Gamepad2', '#6C2B90'),
  ('Autodesk Maya', 'Maya', 'Box', '#00A4E3'),
  ('Adobe Premiere', 'Premiere', 'Film', '#9999FF'),
  ('Adobe After Effects', 'AE', 'Wand2', '#CF96FD'),
  ('Sony Vegas', 'Vegas', 'Play', '#7B68EE'),
  ('DaVinci Resolve', 'DaVinci', 'Film', '#FF4B4B'),
  ('Adobe Photoshop', 'PS', 'Image', '#31A8FF'),
  ('Adobe Animate', 'Animate', 'Palette', '#FF8AC9'),
  ('Substance Painter', 'Substance', 'Brush', '#C4282D'),
  ('Microsoft Office', 'Office', 'FileSpreadsheet', '#D83B01'),
  ('Movie Magic Scheduling', 'MMS', 'Calendar', '#FF4B4B')
ON CONFLICT (name) DO UPDATE SET
  short_name = EXCLUDED.short_name,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color;