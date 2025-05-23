import { Tool, CustomRole } from '../../types/project';

export interface FormData {
  type: string;
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

export interface FormErrors {
  title?: string;
  shortdescription?: string;
  fulldescription?: string;
  image?: string;
  year?: string;
  role?: string;
  tools?: string;
}

export interface Video {
  title: string;
  url: string;
  thumbnail?: string;
}

export interface SoftwareFormData {
  title: string;
  icon: string;
  color: string;
  role?: string;
}