/*
  # Add category to tools table

  1. Changes
    - Add category column to tools table
    - Update existing tools with appropriate categories
    - Ensure RLS policies are correct

  2. Categories
    - 3D: For 3D modeling and game development tools
    - Video: For video editing and post-production tools
    - Design: For graphic design and animation tools
    - Business: For office and project management tools
    - Other: Default category for uncategorized tools
*/

-- Add category column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tools' AND column_name = 'category'
  ) THEN
    ALTER TABLE tools ADD COLUMN category text;
  END IF;
END $$;

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

-- Make category NOT NULL after populating data
ALTER TABLE tools ALTER COLUMN category SET NOT NULL;

-- Ensure RLS policies are correct
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
  DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage tools"
  ON tools FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);