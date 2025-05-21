/*
  # Tools and Project Tools Tables

  1. New Tables
    - `tools`: Stores tool information (name, icon, color)
    - `project_tools`: Junction table for projects-tools many-to-many relationship
  
  2. Security
    - Enable RLS on both tables
    - Add public read access policies
*/

-- Create tools table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS tools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    icon text NOT NULL,
    color text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create junction table for many-to-many relationship if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS project_tools (
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tool_id)
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to tools" ON tools;
DROP POLICY IF EXISTS "Allow public read access to project_tools" ON project_tools;

-- Add RLS policies
CREATE POLICY "Allow public read access to tools" ON tools
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to project_tools" ON project_tools
  FOR SELECT TO public USING (true);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;

-- Add updated_at trigger for tools
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();