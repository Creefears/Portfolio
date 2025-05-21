/*
  # Create tools table and project relationships

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
    - Add policies for public access
*/

-- Create tools table
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS project_tools (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tool_id)
);

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow public read access to tools" ON tools
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access to project_tools" ON project_tools
  FOR SELECT TO public USING (true);

-- Add updated_at trigger for tools
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();