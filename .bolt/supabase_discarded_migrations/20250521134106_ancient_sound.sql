/*
  # Migrate Project Tools Data
  
  1. Changes
    - Create temporary function to migrate tool data from JSON to junction table
    - Handle ambiguous column reference issue
    - Add RLS policies for project_tools table
  
  2. Data Migration
    - Extract tool names from projects.tools JSON array
    - Create corresponding records in project_tools junction table
    
  3. Security
    - Add public access policy for project_tools
*/

-- Create temporary function to handle JSON array of tools
CREATE OR REPLACE FUNCTION temp_migrate_project_tools()
RETURNS void AS $$
DECLARE
  project_record RECORD;
  tool_name TEXT;
  found_tool_id UUID;
BEGIN
  FOR project_record IN SELECT id, tools FROM projects LOOP
    IF project_record.tools IS NOT NULL THEN
      FOR tool_name IN SELECT DISTINCT jsonb_array_elements(project_record.tools)->>'name' FROM projects WHERE id = project_record.id LOOP
        -- Get tool ID using different variable name
        SELECT id INTO found_tool_id FROM tools WHERE name = tool_name;
        
        -- Insert into junction table if tool exists
        IF found_tool_id IS NOT NULL THEN
          INSERT INTO project_tools (project_id, tool_id)
          VALUES (project_record.id, found_tool_id)
          ON CONFLICT (project_id, tool_id) DO NOTHING;
        END IF;
      END LOOP;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute migration
SELECT temp_migrate_project_tools();

-- Clean up
DROP FUNCTION temp_migrate_project_tools();

-- Add policies for project_tools if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE schemaname = 'public' 
    AND tablename = 'project_tools' 
    AND policyname = 'Allow public access to project_tools'
  ) THEN
    CREATE POLICY "Allow public access to project_tools"
      ON project_tools
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;