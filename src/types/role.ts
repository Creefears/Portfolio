export interface Role {
  id?: string;
  name: string;
  description?: string;
  colors: {
    bg: string;
    text: string;
  };
  created_at?: string;
  updated_at?: string;
}