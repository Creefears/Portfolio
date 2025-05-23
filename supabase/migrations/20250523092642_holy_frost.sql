/*
  # Add thumbnail support for videos

  1. Changes
    - Add thumbnail field to videos JSONB array in projects table
    - Update existing videos to include thumbnail field
    - Ensure backward compatibility
  
  2. Notes
    - Videos are stored as a JSONB array with structure:
      {
        title: string,
        url: string,
        thumbnail?: string
      }
*/

-- Create a function to add thumbnail field to videos array if it doesn't exist
CREATE OR REPLACE FUNCTION ensure_video_thumbnail_field()
RETURNS void AS $$
BEGIN
  -- Update projects table where videos column exists
  UPDATE projects
  SET videos = (
    SELECT jsonb_agg(
      CASE
        WHEN jsonb_typeof(video) = 'object' AND video ? 'title' AND video ? 'url'
        THEN jsonb_set(
          video,
          '{thumbnail}',
          COALESCE((video ->> 'thumbnail')::jsonb, 'null'::jsonb)
        )
        ELSE video
      END
    )
    FROM jsonb_array_elements(videos) video
  )
  WHERE videos IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT ensure_video_thumbnail_field();

-- Drop the function after use
DROP FUNCTION ensure_video_thumbnail_field();