import { Tool, CustomRole } from '../../types/project';

export interface FormData {
  type: string;
  title: string;
  title_en?: string;
  shortdescription: string;
  shortdescription_en?: string;
  fulldescription: string;
  fulldescription_en?: string;
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
}

export interface SoftwareFormData {
  title: string;
  icon: string;
  color: string;
  role?: string;
}