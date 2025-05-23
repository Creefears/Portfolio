/*
  # Add thumbnail field to videos

  1. Changes
    - Add thumbnail field to videos array in projects table
    - Update existing video entries to include thumbnail field
    - Handle null values and edge cases
*/

CREATE OR REPLACE FUNCTION ensure_video_thumbnail_field()
RETURNS void AS $$
DECLARE
  project_record RECORD;
  updated_videos jsonb;
BEGIN
  FOR project_record IN SELECT id, videos FROM projects WHERE videos IS NOT NULL LOOP
    WITH video_array AS (
      SELECT jsonb_array_elements(project_record.videos) AS video
    )
    SELECT jsonb_agg(
      CASE
        WHEN (video::jsonb ? 'title') AND (video::jsonb ? 'url')
        THEN jsonb_set(
          video::jsonb,
          '{thumbnail}',
          COALESCE(
            (video::jsonb ->> 'thumbnail')::jsonb,
            'null'::jsonb
          )
        )
        ELSE video
      END
    ) INTO updated_videos
    FROM video_array;

    IF updated_videos IS NOT NULL THEN
      UPDATE projects 
      SET videos = updated_videos 
      WHERE id = project_record.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT ensure_video_thumbnail_field();

-- Drop the function after use
DROP FUNCTION ensure_video_thumbnail_field();