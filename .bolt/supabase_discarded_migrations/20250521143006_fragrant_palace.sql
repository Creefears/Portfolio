/*
  # Fix tools table structure and data

  1. Changes
    - Drop existing policies to avoid conflicts
    - Recreate tools table with correct structure
    - Add proper RLS policies
    - Insert default tools data
    
  2. Security
    - Enable RLS
    - Add public read access policy
    - Add authenticated users management policy
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow public access to tools" ON tools;
DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;

-- Recreate tools table with correct structure
DROP TABLE IF EXISTS tools;
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