export interface Tool {
  id?: string;
  name: string;
  icon: string;
  color: string;
  role?: string;
}

export interface Role {
  id?: string;
  name: string;
  color: string;
  icon: string;
}

export interface CustomRole {
  title: string;
  color: string;
  icon: string;
}

export interface Project {
  id?: string;
  title: string;
  shortdescription: string;
  fulldescription: string;
  image: string;
  video?: string;
  videos?: Array<{ title: string; url: string; }>;
  images?: string[];
  year: string;
  role: string;
  customRoles?: CustomRole[];
  tools: Tool[];
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCardProps {
  id?: string;
  title: string;
  shortdescription: string;
  fulldescription: string;
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