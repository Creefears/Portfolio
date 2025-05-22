export interface Role {
  id?: string;
  name: string;
  description?: string;
  color: string;
  permissions?: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    admin: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface RoleColors {
  bg: string;
  text: string;
}