/*
  # Add short name to tools table

  1. Changes
    - Add short_name column to tools table
    - Update existing tools with appropriate short names
    - Add NOT NULL constraint
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add short_name column
ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS short_name text NOT NULL DEFAULT '';

-- Update existing tools with short names
UPDATE tools SET short_name = 
  CASE name
    WHEN 'Blender' THEN 'Blender'
    WHEN 'Unity' THEN 'Unity'
    WHEN 'Unreal Engine 5' THEN 'UE5'
    WHEN 'Adobe Premiere' THEN 'Premiere'
    WHEN 'Adobe After Effects' THEN 'AE'
    WHEN 'Adobe Photoshop' THEN 'PS'
    WHEN 'Adobe Animate' THEN 'Animate'
    WHEN 'Microsoft Office' THEN 'Office'
    WHEN 'Movie Magic Scheduling' THEN 'MMS'
    WHEN 'Sony Vegas' THEN 'Vegas'
    WHEN 'DaVinci Resolve' THEN 'DaVinci'
    WHEN 'Autodesk Maya' THEN 'Maya'
    WHEN 'Substance Painter' THEN 'Substance'
    ELSE substring(name from 1 for 3)
  END;

-- Remove default constraint
ALTER TABLE tools ALTER COLUMN short_name DROP DEFAULT;