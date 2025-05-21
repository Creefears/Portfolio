-- Ensure table structure is correct
CREATE TABLE IF NOT EXISTS tools (
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

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow public access to tools" ON tools;
DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;

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