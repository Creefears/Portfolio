import { Tool } from './tool';

export interface Video {
  title: string;
  url: string;
  thumbnail?: string;
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
  videos?: Video[];
  images?: string[];
  year: string;
  role: string;
  customRoles?: CustomRole[];
  tools: Tool[];
}

export interface ProjectCardProps {
  id?: string;
  title: string;
  shortdescription: string;
  fulldescription: string;
  image: string;
  video?: string;
  videos?: Video[];
  images?: string[];
  year: string;
  role: string;
  customRoles?: CustomRole[];
  tools: Tool[];
  index: number;
  totalProjects: number;
  allProjects: Project[];
}