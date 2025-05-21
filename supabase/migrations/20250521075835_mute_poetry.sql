/*
  # Fix Projects RLS Policies

  1. Changes
    - Drops existing INSERT policy if it exists
    - Creates new INSERT policy for authenticated users
  
  2. Security
    - Ensures only authenticated users can insert new projects
    - Maintains existing RLS policies for other operations
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.projects;

-- Create new INSERT policy with proper conditions
CREATE POLICY "Enable insert access for authenticated users" 
ON public.projects
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);