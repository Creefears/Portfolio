import { createClient } from '@supabase/supabase-js';
import type { Experience } from '../types/experience';
import type { Project } from '../types/project';

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
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform the data to match frontend property names
    const transformedData = data?.map(project => ({
      ...project,
      shortdescription: project.shortdescription,
      fulldescription: project.fulldescription,
    })) || [];

    return transformedData;
  } catch (error) {
    handleSupabaseError(error, 'projects fetch');
    return [];
  }
};

export const saveProject = async (project: Project, type: 'cgi' | 'real'): Promise<Project> => {
  try {
    // Transform the data to match database column names
    const transformedProject = {
      ...project,
      shortdescription: project.shortdescription,
      fulldescription: project.fulldescription,
      type: type.toUpperCase(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([transformedProject])
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from Supabase after insert');
    }

    // Transform back to frontend property names
    return {
      ...data,
      shortDescription: data.shortdescription,
      fullDescription: data.fulldescription,
    };
  } catch (error) {
    handleSupabaseError(error, 'project save');
    throw error;
  }
};

export const updateProject = async (project: Project, id: string): Promise<void> => {
  try {
    // Transform the data to match database column names
    const transformedProject = {
      ...project,
      shortdescription: project.shortDescription,
      fulldescription: project.fullDescription,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('projects')
      .update(transformedProject)
      .eq('id', id);

    if (error) {
      throw error;
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