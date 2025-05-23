/*
  # Add thumbnails to project videos

  1. Changes
    - Adds thumbnail field to video objects in projects.videos array
    - Uses existing image field as fallback for thumbnail if present
    - Preserves all other video data
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
    -- Process each video in the array to ensure thumbnail field exists
    WITH video_array AS (
      SELECT jsonb_array_elements(project_record.videos) AS video
    )
    SELECT jsonb_agg(
      CASE 
        WHEN video ? 'title' AND video ? 'url'
        THEN jsonb_build_object(
          'title', video ->> 'title',
          'url', video ->> 'url',
          'thumbnail', COALESCE(video ->> 'thumbnail', video ->> 'image', null)
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