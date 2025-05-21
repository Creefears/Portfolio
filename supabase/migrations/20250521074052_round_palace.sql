/*
  # Add fullDescription column to projects table

  1. Changes
    - Adds `fulldescription` column to projects table
    - Sets default value to empty string
    - Makes column non-nullable for data consistency

  2. Notes
    - Uses safe DO block to prevent errors if column already exists
    - Maintains data integrity by providing default value
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