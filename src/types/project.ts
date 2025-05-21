export interface Tool {
  name: string;
  icon: string;
  color: string;
  role?: string;
}

export interface CustomRole {
  title: string;
  color: string;
  icon: string;
}

export interface Project {
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  video?: string;
  videos?: Array<{ title: string; url: string; }>;
  images?: string[];
  year: string;
  role: string;
  customRoles?: CustomRole[];
  tools: Tool[];
}

export interface ProjectCardProps {
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  video?: string;
  videos?: Array<{ title: string; url: string; }>;
  images?: string[];
  year: string;
  role: string;
  customRoles?: CustomRole[];
  tools: Tool[];
  index: number;
  totalProjects: number;
  allProjects: Project[];
}