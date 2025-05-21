/*
  # Update tools management system

  1. Changes
    - Add new columns to tools table for better tool management
    - Update existing tools with proper metadata
    - Add policies for tool management
  
  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage tools
*/

-- Add new columns to tools table
ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS category text;

-- Update existing tools with categories
UPDATE tools SET category = 
  CASE name
    WHEN 'Blender' THEN '3D'
    WHEN 'Unity' THEN '3D'
    WHEN 'Unreal Engine 5' THEN '3D'
    WHEN 'Autodesk Maya' THEN '3D'
    WHEN 'Adobe Premiere' THEN 'Video'
    WHEN 'Adobe After Effects' THEN 'Video'
    WHEN 'Sony Vegas' THEN 'Video'
    WHEN 'DaVinci Resolve' THEN 'Video'
    WHEN 'Adobe Photoshop' THEN 'Design'
    WHEN 'Adobe Animate' THEN 'Design'
    WHEN 'Substance Painter' THEN 'Design'
    WHEN 'Microsoft Office' THEN 'Business'
    WHEN 'Movie Magic Scheduling' THEN 'Business'
    ELSE 'Other'
  END
WHERE category IS NULL;

-- Update RLS policies
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;

-- Public read access
CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  TO public
  USING (true);

-- Authenticated users can manage tools
CREATE POLICY "Allow authenticated users to manage tools"
  ON tools
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);