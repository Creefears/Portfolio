/*
  # Tools Table Schema Update

  1. Changes
    - Add short_name column to tools table
    - Ensure RLS is enabled
    - Update policies if needed

  2. Security
    - Maintain existing RLS policies
    - Keep public read access
    - Allow authenticated users full access
*/

DO $$ BEGIN
  -- Add short_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tools' AND column_name = 'short_name'
  ) THEN
    ALTER TABLE tools ADD COLUMN short_name text NOT NULL;
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;

-- Recreate policies
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