/*
  # Add status field to projects table

  1. Changes
    - Add `status` column to `projects` table with type `text`
    - Make the field nullable since existing records won't have a status
    - Add a default value of 'draft' for new records

  2. Security
    - No changes to RLS policies needed as the existing policies will cover the new field
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE projects 
    ADD COLUMN status text DEFAULT 'draft';
  END IF;
END $$;