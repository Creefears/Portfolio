/*
  # Create videos storage bucket

  1. Changes
    - Create a new storage bucket for videos
    - Set up RLS policies for:
      - Public read access
      - Authenticated user upload/update/delete
  
  2. Security
    - Allow public read access to all videos
    - Restrict upload/modify/delete to authenticated users
*/

-- Create the videos bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'videos'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('videos', 'videos', true);
    END IF;
END $$;

-- Policies for storage.objects
DO $$
BEGIN
    -- Public read access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'videos');
    END IF;

    -- Authenticated upload access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated users can upload videos'
    ) THEN
        CREATE POLICY "Authenticated users can upload videos"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'videos');
    END IF;

    -- Authenticated update access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated users can update their videos'
    ) THEN
        CREATE POLICY "Authenticated users can update their videos"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'videos');
    END IF;

    -- Authenticated delete access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated users can delete their videos'
    ) THEN
        CREATE POLICY "Authenticated users can delete their videos"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'videos');
    END IF;
END $$;