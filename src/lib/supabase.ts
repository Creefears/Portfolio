import { createClient } from '@supabase/supabase-js';
import type { Experience } from '../types/experience';
import type { Project, Tool } from '../types/project';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handleSupabaseError = (error: unknown, operation: string) => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    throw new Error(`Network error: Unable to connect to Supabase. Please check your internet connection and try again.`);
  }
  console.error(`Supabase ${operation} error:`, error);
  throw error;
};

export const getProjects = async (type?: 'CGI' | 'REAL'): Promise<Project[]> => {
  try {
    let query = supabase
      .from('projects')
      .select(`
        *,
        project_tools (
          tools (
            id,
            name,
            icon,
            color
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform the nested tools data into the expected format
    return (data || []).map(project => ({
      ...project,
      tools: project.project_tools?.map((pt: any) => pt.tools) || []
    }));
  } catch (error) {
    handleSupabaseError(error, 'projects fetch');
    return [];
  }
};

export const getTools = async (): Promise<Tool[]> => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    handleSupabaseError(error, 'tools fetch');
    return [];
  }
};

export const saveTool = async (tool: Tool): Promise<Tool> => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .insert([tool])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'tool save');
    throw error;
  }
};

export const saveProject = async (project: Project, type: 'cgi' | 'real'): Promise<Project> => {
  try {
    // First, save the project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([{
        ...project,
        type: type.toUpperCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (projectError) {
      throw projectError;
    }

    // Then, create the tool relationships
    if (project.tools?.length > 0) {
      const toolRelationships = project.tools.map(tool => ({
        project_id: projectData.id,
        tool_id: tool.id
      }));

      const { error: relationError } = await supabase
        .from('project_tools')
        .insert(toolRelationships);

      if (relationError) {
        throw relationError;
      }
    }

    return {
      ...projectData,
      tools: project.tools || []
    };
  } catch (error) {
    handleSupabaseError(error, 'project save');
    throw error;
  }
};

export const updateProject = async (project: Project, id: string): Promise<void> => {
  try {
    // First, update the project
    const { error: projectError } = await supabase
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (projectError) {
      throw projectError;
    }

    // Then, update tool relationships
    // First, remove existing relationships
    const { error: deleteError } = await supabase
      .from('project_tools')
      .delete()
      .eq('project_id', id);

    if (deleteError) {
      throw deleteError;
    }

    // Then, add new relationships
    if (project.tools?.length > 0) {
      const toolRelationships = project.tools.map(tool => ({
        project_id: id,
        tool_id: tool.id
      }));

      const { error: relationError } = await supabase
        .from('project_tools')
        .insert(toolRelationships);

      if (relationError) {
        throw relationError;
      }
    }
  } catch (error) {
    handleSupabaseError(error, 'project update');
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    handleSupabaseError(error, 'project delete');
    throw error;
  }
};

export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      throw error;
    }

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
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from Supabase after insert');
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, 'experience save');
    throw error;
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
      throw error;
    }
  } catch (error) {
    handleSupabaseError(error, 'experience update');
    throw error;
  }
};

export const deleteExperience = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    handleSupabaseError(error, 'experience delete');
    throw error;
  }
};