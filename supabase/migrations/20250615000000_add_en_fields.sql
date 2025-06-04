/*
  # Add English translation fields
  Adds title_en, shortDescription_en, fullDescription_en to projects
  and role_en, company_en, description_en to experiences.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='title_en'
  ) THEN
    ALTER TABLE projects ADD COLUMN title_en text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='shortDescription_en'
  ) THEN
    ALTER TABLE projects ADD COLUMN "shortDescription_en" text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='fulldescription_en'
  ) THEN
    ALTER TABLE projects ADD COLUMN fulldescription_en text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='role_en'
  ) THEN
    ALTER TABLE experiences ADD COLUMN role_en text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='company_en'
  ) THEN
    ALTER TABLE experiences ADD COLUMN company_en text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='description_en'
  ) THEN
    ALTER TABLE experiences ADD COLUMN description_en text;
  END IF;
END $$;
