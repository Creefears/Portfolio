/*
  # Tools and Project Tools Tables

  1. New Tables
    - `tools`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `icon` (text)
      - `color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `project_tools` (junction table)
      - `project_id` (uuid, foreign key)
      - `tool_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create tools table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tools') THEN
    CREATE TABLE tools (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text UNIQUE NOT NULL,
      icon text NOT NULL,
      color text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

    -- Add updated_at trigger
    CREATE TRIGGER update_tools_updated_at
      BEFORE UPDATE ON tools
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create project_tools junction table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project_tools') THEN
    CREATE TABLE project_tools (
      project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
      tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
      PRIMARY KEY (project_id, tool_id)
    );

    -- Enable RLS
    ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- For tools table
  DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
  DROP POLICY IF EXISTS "Allow authenticated users to manage tools" ON tools;
  
  -- For project_tools table
  DROP POLICY IF EXISTS "Allow public read access to project_tools" ON project_tools;
  DROP POLICY IF EXISTS "Allow authenticated users to manage project_tools" ON project_tools;
END $$;

-- Create new policies
CREATE POLICY "Allow public read access to tools" ON tools
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to manage tools" ON tools
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to project_tools" ON project_tools
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to manage project_tools" ON project_tools
  FOR ALL TO authenticated USING (true) WITH CHECK (true);