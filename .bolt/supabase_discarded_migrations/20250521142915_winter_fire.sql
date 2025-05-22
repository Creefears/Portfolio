/*
  # Fix tools table structure and policies

  1. Table Structure
    - Ensure correct columns for tools table
    - Add short_name column
    - Add category column for better organization

  2. Security
    - Enable RLS
    - Add proper policies for public and authenticated access

  3. Triggers
    - Add updated_at trigger
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow public access to tools" ON tools;
DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;

-- Recreate tools table with correct structure
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  short_name text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  category text NOT NULL,
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

-- Insert default tools with categories
INSERT INTO tools (name, short_name, icon, color, category) VALUES
  ('Blender', 'Blender', 'Box', '#EA7600', '3D'),
  ('Unity', 'Unity', 'Gamepad2', '#4C9EDE', '3D'),
  ('Unreal Engine 5', 'UE5', 'Gamepad2', '#6C2B90', '3D'),
  ('Autodesk Maya', 'Maya', 'Box', '#00A4E3', '3D'),
  ('Adobe Premiere', 'Premiere', 'Film', '#9999FF', 'Video'),
  ('Adobe After Effects', 'AE', 'Wand2', '#CF96FD', 'Video'),
  ('Sony Vegas', 'Vegas', 'Play', '#7B68EE', 'Video'),
  ('DaVinci Resolve', 'DaVinci', 'Film', '#FF4B4B', 'Video'),
  ('Adobe Photoshop', 'PS', 'Image', '#31A8FF', 'Design'),
  ('Adobe Animate', 'Animate', 'Palette', '#FF8AC9', 'Design'),
  ('Substance Painter', 'Substance', 'Brush', '#C4282D', 'Design'),
  ('Microsoft Office', 'Office', 'FileSpreadsheet', '#D83B01', 'Business'),
  ('Movie Magic Scheduling', 'MMS', 'Calendar', '#FF4B4B', 'Business')
ON CONFLICT (name) DO UPDATE SET
  short_name = EXCLUDED.short_name,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  category = EXCLUDED.category;