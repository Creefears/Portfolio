export interface Tool {
  id?: string;
  name: string;
  short_name: string;
  icon: string;
  color: string;
  category: string;
}

export interface CustomRole {
  title: string;
  color: string;
  icon: string;
}

export interface Project {
  id?: string;
  title: string;
  title_en?: string;
  shortdescription: string;
  shortdescription_en?: string;
  fulldescription: string;
  fulldescription_en?: string;
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
  title_en?: string;
  shortdescription: string;
  shortdescription_en?: string;
  fulldescription: string;
  fulldescription_en?: string;
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