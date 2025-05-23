import { createClient } from '@supabase/supabase-js';
import type { Experience } from '../types/experience';
import type { Project } from '../types/project';
import type { Tool } from '../types/project';
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
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    timestamp,
    operation
  };
};

// Retry mechanism with exponential backoff
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Role operations
export const getRoles = async (): Promise<Role[]> => {
  try {
    const result = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    });
    
    return result;
  } catch (error) {
    handleSupabaseError(error, 'roles fetch');
    return [];
  }
};

export const saveRole = async (role: Partial<Role>): Promise<Role> => {
  try {
    return await retryOperation(async () => {
      let query;
      
      if (role.id) {
        // Update existing role
        query = supabase
          .from('roles')
          .update({
            name: role.name,
            color: role.color,
            updated_at: new Date().toISOString()
          })
          .eq('id', role.id)
          .select();
      } else {
        // Insert new role
        query = supabase
          .from('roles')
          .insert([{
            name: role.name,
            color: role.color,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
      }

      const { data, error } = await query.single();

      if (error) {
        const errorInfo = handleSupabaseError(error, 'role save');
        throw new Error(errorInfo.message);
      }

      if (!data) {
        throw new Error('No data returned from Supabase after role operation');
      }

      return data;
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'role save');
    throw new Error(errorInfo.message);
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    await retryOperation(async () => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) {
        const errorInfo = handleSupabaseError(error, 'role delete');
        throw new Error(errorInfo.message);
      }
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'role delete');
    throw new Error(errorInfo.message);
  }
};

// Tool operations
export const getTools = async (): Promise<Tool[]> => {
  try {
    const result = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    });
    
    return result;
  } catch (error) {
    handleSupabaseError(error, 'tools fetch');
    return [];
  }
};

export const saveTool = async (tool: Partial<Tool>): Promise<Tool> => {
  try {
    return await retryOperation(async () => {
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
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'tool save');
    throw new Error(errorInfo.message);
  }
};

export const deleteTool = async (id: string): Promise<void> => {
  try {
    await retryOperation(async () => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) {
        const errorInfo = handleSupabaseError(error, 'tool delete');
        throw new Error(errorInfo.message);
      }
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'tool delete');
    throw new Error(errorInfo.message);
  }
};

// Project operations
export const getProjects = async (type?: 'CGI' | 'REAL'): Promise<Project[]> => {
  try {
    const result = await retryOperation(async () => {
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
    });
    
    return result;
  } catch (error) {
    handleSupabaseError(error, 'projects fetch');
    return [];
  }
};

export const saveProject = async (project: Project): Promise<Project> => {
  try {
    return await retryOperation(async () => {
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
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'project save');
    throw new Error(errorInfo.message);
  }
};

export const updateProject = async (project: Project, id: string): Promise<void> => {
  try {
    await retryOperation(async () => {
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
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'project update');
    throw new Error(errorInfo.message);
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await retryOperation(async () => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        const errorInfo = handleSupabaseError(error, 'project delete');
        throw new Error(errorInfo.message);
      }
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'project delete');
    throw new Error(errorInfo.message);
  }
};

// Experience operations
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const result = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      return data || [];
    });
    
    return result;
  } catch (error) {
    handleSupabaseError(error, 'experiences fetch');
    return [];
  }
};

export const saveExperience = async (experience: Experience): Promise<Experience> => {
  try {
    return await retryOperation(async () => {
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
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'experience save');
    throw new Error(errorInfo.message);
  }
};

export const updateExperience = async (experience: Experience, id: string): Promise<void> => {
  try {
    await retryOperation(async () => {
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
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'experience update');
    throw new Error(errorInfo.message);
  }
};

export const deleteExperience = async (id: string): Promise<void> => {
  try {
    await retryOperation(async () => {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) {
        const errorInfo = handleSupabaseError(error, 'experience delete');
        throw new Error(errorInfo.message);
      }
    });
  } catch (error) {
    const errorInfo = handleSupabaseError(error, 'experience delete');
    throw new Error(errorInfo.message);
  }
};