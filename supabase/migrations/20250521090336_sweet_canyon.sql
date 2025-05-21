/*
  # Fix Projects Table RLS Policies

  1. Changes
    - Update the INSERT policy for projects table to properly check auth.uid()
    - Ensure consistent policy naming and conditions

  2. Security
    - Maintains RLS enabled status
    - Updates INSERT policy to match other authenticated policies
    - Keeps existing SELECT, UPDATE, and DELETE policies
*/

-- Drop the existing INSERT policy that's not working correctly
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.projects;

-- Create new INSERT policy with proper auth check
CREATE POLICY "Enable insert access for authenticated users"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);