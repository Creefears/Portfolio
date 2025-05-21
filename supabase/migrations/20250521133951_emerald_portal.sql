/*
  # Update tools table with default values

  1. Changes
    - Insert default tools with icons and colors
    - Update existing tools if they already exist

  2. Security
    - Ensure RLS is enabled
    - Drop existing policies if they exist
    - Create new policies for public read access
*/

-- Insert or update default tools
INSERT INTO tools (name, icon, color) VALUES
  ('Blender', 'Box', '#EA7600'),
  ('Adobe Premiere', 'Film', '#9999FF'),
  ('Unreal Engine 5', 'Gamepad2', '#6C2B90'),
  ('Adobe After Effects', 'Wand2', '#CF96FD'),
  ('Unity', 'Gamepad2', '#4C9EDE'),
  ('Substance Painter', 'Brush', '#C4282D'),
  ('Autodesk Maya', 'Box', '#00A4E3'),
  ('Adobe Animate', 'Palette', '#FF8AC9'),
  ('Adobe Photoshop', 'Image', '#31A8FF'),
  ('Microsoft Office', 'FileSpreadsheet', '#D83B01'),
  ('Movie Magic Scheduling', 'Calendar', '#FF4B4B'),
  ('Sony Vegas', 'Play', '#7B68EE')
ON CONFLICT (name) DO UPDATE SET
  icon = EXCLUDED.icon,
  color = EXCLUDED.color;

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'tools' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'project_tools' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
  DROP POLICY IF EXISTS "Allow public read access to project_tools" ON project_tools;
END $$;

-- Create new policies
CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to project_tools"
  ON project_tools FOR SELECT
  TO public
  USING (true);