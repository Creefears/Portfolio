/*
  # Add thumbnail support for videos

  1. Changes
    - Add thumbnail field to videos array in projects table
    - Update existing videos to include thumbnail field
    - Ensure data consistency
  
  2. Notes
    - Uses jsonb_set to safely add thumbnail field
    - Preserves existing data
*/

DO $$ 
DECLARE
  project_record RECORD;
  updated_videos jsonb;
BEGIN
  -- Loop through all projects with videos
  FOR project_record IN 
    SELECT id, videos 
    FROM projects 
    WHERE videos IS NOT NULL 
  LOOP
    -- Process each video in the array
    WITH video_array AS (
      SELECT jsonb_array_elements(project_record.videos) AS video
    )
    SELECT jsonb_agg(
      CASE 
        WHEN video ? 'title' AND video ? 'url'
        THEN jsonb_set(
          video,
          '{thumbnail}',
          COALESCE((video ->> 'thumbnail')::jsonb, 'null'::jsonb)
        )
        ELSE video
      END
    ) INTO updated_videos
    FROM video_array;

    -- Update the project if we have processed videos
    IF updated_videos IS NOT NULL THEN
      UPDATE projects 
      SET videos = updated_videos 
      WHERE id = project_record.id;
    END IF;
  END LOOP;
END $$;