/*
  # Add fullDescription column to projects table

  1. Changes
    - Add `fullDescription` column to `projects` table
      - Type: text
      - Not nullable
      - Default value: empty string

  2. Notes
    - Using DO block to safely add column if it doesn't exist
    - Setting default value to ensure data consistency
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'fulldescription'
  ) THEN
    ALTER TABLE projects 
    ADD COLUMN fulldescription text NOT NULL DEFAULT '';
  END IF;
END $$;