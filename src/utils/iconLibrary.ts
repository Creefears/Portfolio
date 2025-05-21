import * as Icons from 'lucide-react';

export interface IconOption {
  value: string;
  label: string;
  category: string;
  icon: React.ElementType;
}

export const iconLibrary: IconOption[] = [
  // Design & Creative
  { value: 'Palette', label: 'Palette', category: 'Design', icon: Icons.Palette },
  { value: 'PenTool', label: 'Design', category: 'Design', icon: Icons.PenTool },
  { value: 'Brush', label: 'Pinceau', category: 'Design', icon: Icons.Brush },
  { value: 'Wand2', label: 'Effets', category: 'Design', icon: Icons.Wand2 },
  { value: 'Scissors', label: 'Découpe', category: 'Design', icon: Icons.Scissors },
  { value: 'Layers', label: 'Calques', category: 'Design', icon: Icons.Layers },

  // 3D & Animation
  { value: 'Box', label: 'Box 3D', category: '3D', icon: Icons.Box },
  { value: 'Cube', label: 'Cube 3D', category: '3D', icon: Icons.Cube },
  { value: 'Shapes', label: 'Formes', category: '3D', icon: Icons.Shapes },
  { value: 'Component', label: 'Composants', category: '3D', icon: Icons.Component },
  { value: 'Boxes', label: 'Modèles', category: '3D', icon: Icons.Boxes },
  { value: 'Gamepad2', label: 'Jeu', category: '3D', icon: Icons.Gamepad2 },

  // Video & Production
  { value: 'Film', label: 'Film', category: 'Video', icon: Icons.Film },
  { value: 'Video', label: 'Vidéo', category: 'Video', icon: Icons.Video },
  { value: 'Camera', label: 'Caméra', category: 'Video', icon: Icons.Camera },
  { value: 'Clapperboard', label: 'Clap', category: 'Video', icon: Icons.Clapperboard },
  { value: 'PlaySquare', label: 'Lecture', category: 'Video', icon: Icons.PlaySquare },
  { value: 'Scissors', label: 'Montage', category: 'Video', icon: Icons.Scissors },

  // Development
  { value: 'Code', label: 'Code', category: 'Dev', icon: Icons.Code },
  { value: 'Terminal', label: 'Terminal', category: 'Dev', icon: Icons.Terminal },
  { value: 'Database', label: 'Database', category: 'Dev', icon: Icons.Database },
  { value: 'GitBranch', label: 'Git', category: 'Dev', icon: Icons.GitBranch },
  { value: 'Laptop', label: 'Laptop', category: 'Dev', icon: Icons.Laptop },
  { value: 'Server', label: 'Serveur', category: 'Dev', icon: Icons.Server },

  // Business & Management
  { value: 'Briefcase', label: 'Mallette', category: 'Business', icon: Icons.Briefcase },
  { value: 'GraduationCap', label: 'Diplôme', category: 'Business', icon: Icons.GraduationCap },
  { value: 'Trophy', label: 'Trophée', category: 'Business', icon: Icons.Trophy },
  { value: 'Target', label: 'Objectif', category: 'Business', icon: Icons.Target },
  { value: 'Users', label: 'Équipe', category: 'Business', icon: Icons.Users },
  { value: 'Star', label: 'Star', category: 'Business', icon: Icons.Star },

  // Communication & Media
  { value: 'MessageSquare', label: 'Message', category: 'Communication', icon: Icons.MessageSquare },
  { value: 'Mail', label: 'Email', category: 'Communication', icon: Icons.Mail },
  { value: 'Share2', label: 'Partage', category: 'Communication', icon: Icons.Share2 },
  { value: 'Megaphone', label: 'Annonce', category: 'Communication', icon: Icons.Megaphone },
  { value: 'Rss', label: 'RSS', category: 'Communication', icon: Icons.Rss },
  { value: 'Globe', label: 'Web', category: 'Communication', icon: Icons.Globe },
];

export const getIconByValue = (value: string): React.ElementType => {
  const iconOption = iconLibrary.find(icon => icon.value === value);
  return iconOption?.icon || Icons.HelpCircle;
};

export const getIconCategories = (): string[] => {
  return Array.from(new Set(iconLibrary.map(icon => icon.category)));
};

export const getIconsByCategory = (category: string): IconOption[] => {
  return iconLibrary.filter(icon => icon.category === category);
};