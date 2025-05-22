import { createClient } from '@supabase/supabase-js';
import type { Role } from '../types/role';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  db: {
    schema: 'public'
  }
});

// Role operations with optimized error handling and caching
const ROLES_CACHE_KEY = 'roles_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let rolesCache: {
  data: Role[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

export const getRoles = async (): Promise<Role[]> => {
  try {
    // Check cache first
    const now = Date.now();
    if (rolesCache.data && (now - rolesCache.timestamp) < CACHE_DURATION) {
      return rolesCache.data;
    }

    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;

    // Update cache
    rolesCache = {
      data: data || [],
      timestamp: now
    };

    return data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Return cached data if available, otherwise empty array
    return rolesCache.data || [];
  }
};

export const saveRole = async (role: Partial<Role>): Promise<Role> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .upsert([{
        ...role,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    // Invalidate cache
    rolesCache.data = null;

    return data;
  } catch (error) {
    console.error('Error saving role:', error);
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

    // Invalidate cache
    rolesCache.data = null;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};