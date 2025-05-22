/*
  # Add default roles

  1. Changes
    - Insert default roles with predefined colors
*/

INSERT INTO roles (name, color)
VALUES
  ('Réalisateur', '#9333EA'),
  ('Assistant Réalisateur', '#9333EA'),
  ('1er Assistant Réalisateur', '#9333EA'),
  ('2ème Assistant Réalisateur', '#9333EA'),
  ('Monteur Vidéo', '#22C55E'),
  ('1er Monteur Vidéo', '#22C55E'),
  ('Chargé de Production', '#EAB308'),
  ('Concepteur 3D', '#EF4444'),
  ('Modeleur', '#EF4444'),
  ('Animateur', '#EF4444'),
  ('Intégrale', '#3B82F6')
ON CONFLICT (name) DO UPDATE
SET color = EXCLUDED.color;