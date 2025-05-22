import { createClient } from '@supabase/supabase-js';
import type { Experience } from '../types/experience';
import type { Project } from '../types/project';
import type { Tool } from '../types/project';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Check if we're in a browser environment and verify network connectivity
const checkNetworkConnectivity = () => {
  if (typeof window !== 'undefined' && !navigator.onLine) {
    throw new Error('No internet connection. Please check your network and try again.');
  }
};

// Initialize Supabase client with error handling
let supabaseInstance: ReturnType<typeof createClient>;

try {
  checkNetworkConnectivity();
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  throw new Error('Unable to connect to the database. Please try again later.');
}

export const supabase = supabaseInstance;

const handleSupabaseError = (error: unknown, operation: string) => {
  checkNetworkConnectivity();
  
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    throw new Error(`Network error: Unable to connect to Supabase. Please check your internet connection and try again.`);
  }
  
  if (error instanceof Error) {
    // Handle specific Supabase error cases
    if (error.message.includes('JWT')) {
      throw new Error('Authentication error. Please sign in again.');
    }
    if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
  }
  
  console.error(`Supabase ${operation} error:`, error);
  throw error;
};

// Tool operations
export const getTools = async (): Promise<Tool[]> => {
  try {
    checkNetworkConnectivity();
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'tools fetch');
    return [];
  }
};

export const saveTool = async (tool: Omit<Tool, 'id'>): Promise<Tool> => {
  try {
    checkNetworkConnectivity();
    const { data, error } = await supabase
      .from('tools')
      .insert([tool])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from Supabase after insert');
    return data;
  } catch (error) {
    handleSupabaseError(error, 'tool save');
    throw error;
  }
};

export const deleteTool = async (id: string): Promise<void> => {
  try {
    checkNetworkConnectivity();
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, 'tool delete');
    throw error;
  }
};

// Project operations
export const getProjects = async (type?: 'CGI' | 'REAL'): Promise<Project[]> => {
  try {
    checkNetworkConnectivity();
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'projects fetch');
    return [];
  }
};

export const saveProject = async (project: Project): Promise<Project> => {
  try {
    checkNetworkConnectivity();
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from Supabase after insert');
    return data;
  } catch (error) {
    handleSupabaseError(error, 'project save');
    throw error;
  }
};

export const updateProject = async (project: Project, id: string): Promise<void> => {
  try {
    checkNetworkConnectivity();
    const { error } = await supabase
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, 'project update');
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    checkNetworkConnectivity();
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

// Experience operations
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    checkNetworkConnectivity();
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'experiences fetch');
    return [];
  }
};

export const saveExperience = async (experience: Experience): Promise<Experience> => {
  try {
    checkNetworkConnectivity();
    const { data, error } = await supabase
      .from('experiences')
      .insert([{
        ...experience,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from Supabase after insert');
    return data;
  } catch (error) {
    handleSupabaseError(error, 'experience save');
    throw error;
  }
};

export const updateExperience = async (experience: Experience, id: string): Promise<void> => {
  try {
    checkNetworkConnectivity();
    const { error } = await supabase
      .from('experiences')
      .update({
        ...experience,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, 'experience update');
    throw error;
  }
};

export const deleteExperience = async (id: string): Promise<void> => {
  try {
    checkNetworkConnectivity();
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, 'experience delete');
    throw error;
  }
};