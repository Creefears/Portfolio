import { createClient } from '@supabase/supabase-js';
import type { Role } from '../types/role';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handleSupabaseError = (error: unknown, operation: string) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Supabase ${operation} error:`, error);
  throw error;
};

// Role operations
export const getRoles = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'roles fetch');
    return [];
  }
};

export const saveRole = async (role: Partial<Role>): Promise<Role> => {
  try {
    let query;
    
    if (role.id) {
      // Update existing role
      query = supabase
        .from('roles')
        .update({
          name: role.name,
          description: role.description,
          color: role.color,
          permissions: role.permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', role.id)
        .select();
    } else {
      // Insert new role
      query = supabase
        .from('roles')
        .insert([{
          ...role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
    }

    const { data, error } = await query.single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from Supabase');

    return data;
  } catch (error) {
    handleSupabaseError(error, 'role save');
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, 'role delete');
    throw error;
  }
};

// Project operations
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, 'project delete');
    throw error;
  }
};