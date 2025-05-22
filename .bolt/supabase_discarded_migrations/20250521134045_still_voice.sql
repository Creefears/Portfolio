/*
  # Project Tools Migration

  1. Changes
    - Add project_tools junction table for many-to-many relationship
    - Migrate existing tools data from projects.tools to project_tools
    - Update RLS policies
  
  2. Data Migration
    - Extract tool references from projects.tools JSON array
    - Insert corresponding records into project_tools junction table
*/

-- Create temporary function to handle JSON array of tools
CREATE OR REPLACE FUNCTION temp_migrate_project_tools()
RETURNS void AS $$
DECLARE
  project_record RECORD;
  tool_name TEXT;
  tool_id UUID;
BEGIN
  FOR project_record IN SELECT id, tools FROM projects LOOP
    IF project_record.tools IS NOT NULL THEN
      FOR tool_name IN SELECT DISTINCT jsonb_array_elements(project_record.tools)->>'name' FROM projects WHERE id = project_record.id LOOP
        -- Get tool ID
        SELECT id INTO tool_id FROM tools WHERE name = tool_name;
        
        -- Insert into junction table if tool exists
        IF tool_id IS NOT NULL THEN
          INSERT INTO project_tools (project_id, tool_id)
          VALUES (project_record.id, tool_id)
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