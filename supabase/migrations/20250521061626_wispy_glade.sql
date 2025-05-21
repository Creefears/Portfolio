/*
  # Create initial schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `shortDescription` (text, not null)
      - `fullDescription` (text, not null)
      - `image` (text, not null)
      - `video` (text)
      - `videos` (jsonb)
      - `images` (jsonb)
      - `year` (text, not null)
      - `role` (text, not null)
      - `customRoles` (jsonb)
      - `tools` (jsonb, not null)
      - `type` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `experiences`
      - `id` (uuid, primary key)
      - `year` (text, not null)
      - `role` (text, not null)
      - `company` (text, not null)
      - `description` (text, not null)
      - `icon` (text, not null)
      - `color` (text, not null)
      - `link` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  shortDescription text NOT NULL,
  fullDescription text NOT NULL,
  image text NOT NULL,
  video text,
  videos jsonb,
  images jsonb,
  year text NOT NULL,
  role text NOT NULL,
  customRoles jsonb,
  tools jsonb NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  role text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Anyone can view projects" 
  ON projects
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert projects" 
  ON projects
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their projects" 
  ON projects
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete their projects" 
  ON projects
  FOR DELETE 
  TO authenticated
  USING (true);

-- Create policies for experiences
CREATE POLICY "Anyone can view experiences" 
  ON experiences
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert experiences" 
  ON experiences
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their experiences" 
  ON experiences
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete their experiences" 
  ON experiences
  FOR DELETE 
  TO authenticated
  USING (true);