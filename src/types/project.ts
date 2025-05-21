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
  status?: string;
}

export interface ProjectCardProps extends Project {
  index: number;
  totalProjects: number;
  allProjects: Project[];
}