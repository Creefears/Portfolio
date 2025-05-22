import { createClient } from '@supabase/supabase-js';
import type { Experience } from '../types/experience';
import type { Project } from '../types/project';
import type { Tool } from '../types/project';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handleSupabaseError = (error: unknown, operation: string) => {
  const timestamp = new Date().toISOString();
  const errorDetails = error instanceof Error 
    ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause,
        context: { operation, timestamp }
      }
    : {
        raw: error,
        context: { operation, timestamp }
      };
    
  // Network error check
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    console.error(`[${timestamp}] Supabase network error:`, {
      ...errorDetails,
      type: 'NetworkError',
      operation
    });
    throw new Error(`Network error: Unable to connect to Supabase. Please check your internet connection and try again.`);
  }

  // Detailed error logging
  console.error(`[${timestamp}] Supabase ${operation} error:`, errorDetails);
  
  // Return structured error info
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    timestamp,
    operation,
    details: errorDetails
  };
};

// Tool operations
export const getTools = async (): Promise<Tool[]> => {
  try {
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

export const saveTool = async (tool: Partial<Tool>): Promise<Tool> => {
  try {
    let query;
    
    if (tool.id) {
      // Update existing tool
      query = supabase
        .from('tools')
        .update({
          name: tool.name,
          short_name: tool.short_name,
          icon: tool.icon,
          color: tool.color,
          category: tool.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id)
        .select();
    } else {
      // Insert new tool
      query = supabase
        .from('tools')
        .insert([{
          ...tool,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
    }

    const { data, error } = await query.single();

    if (error) {
      const errorInfo = handleSupabaseError(error, 'tool save');
      throw new Error(errorInfo.message);
    }

    if (!data) {
      throw new Error('No data returned from Supabase after tool operation');
    }

    return data;
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'tool save');
    throw new Error(errorInfo.message);
  }
};

export const deleteTool = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      const errorInfo = handleSupabaseError(error, 'tool delete');
      throw new Error(errorInfo.message);
    }
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'tool delete');
    throw new Error(errorInfo.message);
  }
};

// Project operations
export const getProjects = async (type?: 'CGI' | 'REAL'): Promise<Project[]> => {
  try {
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
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      const errorInfo = handleSupabaseError(error, 'project save');
      throw new Error(errorInfo.message);
    }

    if (!data) {
      throw new Error('No data returned from Supabase after project insert');
    }

    return data;
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'project save');
    throw new Error(errorInfo.message);
  }
};

export const updateProject = async (project: Project, id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      const errorInfo = handleSupabaseError(error, 'project update');
      throw new Error(errorInfo.message);
    }
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'project update');
    throw new Error(errorInfo.message);
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      const errorInfo = handleSupabaseError(error, 'project delete');
      throw new Error(errorInfo.message);
    }
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'project delete');
    throw new Error(errorInfo.message);
  }
};

// Experience operations
export const getExperiences = async (): Promise<Experience[]> => {
  try {
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
    const { data, error } = await supabase
      .from('experiences')
      .insert([{
        ...experience,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      const errorInfo = handleSupabaseError(error, 'experience save');
      throw new Error(errorInfo.message);
    }

    if (!data) {
      throw new Error('No data returned from Supabase after experience insert');
    }

    return data;
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'experience save');
    throw new Error(errorInfo.message);
  }
};

export const updateExperience = async (experience: Experience, id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .update({
        ...experience,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      const errorInfo = handleSupabaseError(error, 'experience update');
      throw new Error(errorInfo.message);
    }
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'experience update');
    throw new Error(errorInfo.message);
  }
};

export const deleteExperience = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) {
      const errorInfo = handleSupabaseError(error, 'experience delete');
      throw new Error(errorInfo.message);
    }
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'experience delete');
    throw new Error(errorInfo.message);
  }
};