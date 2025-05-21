/*
  # Update tools schema

  1. Changes
    - Add default tools data
    - Update tools table structure
    - Add project_tools junction table
    
  2. Security
    - Enable RLS
    - Add policies for public read access
*/

-- Insert default tools
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

-- Update RLS policies
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to project_tools"
  ON project_tools FOR SELECT
  TO public
  USING (true);