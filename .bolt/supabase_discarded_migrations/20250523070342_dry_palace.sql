/*
  # Create videos storage bucket

  1. Changes
    - Create a new storage bucket for project videos
    - Set up RLS policies for public read access
    - Allow authenticated users to upload/delete videos
*/

-- Enable the storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create the videos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access to videos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Create policy to allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Create policy to allow authenticated users to update their videos
CREATE POLICY "Authenticated users can update their videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'videos');

-- Create policy to allow authenticated users to delete their videos
CREATE POLICY "Authenticated users can delete their videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'videos');