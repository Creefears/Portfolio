/*
  # Add tool categories

  1. Changes
    - Add category column to tools table
    - Update existing tools with their categories
    - Ensure RLS policies are correct

  2. Security
    - Maintain existing RLS policies
    - Keep public read access
    - Keep authenticated user management access
*/

-- Add category column if it doesn't exist
ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Other';

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
  END;

-- Remove default constraint after update
ALTER TABLE tools ALTER COLUMN category DROP DEFAULT;

-- Ensure RLS policies are correct
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;

CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage tools"
  ON tools FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);