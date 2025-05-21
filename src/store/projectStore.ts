import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '../types/project';
import { defaultCGIProjects, defaultRealProjects } from '../utils/defaultProjects';
import { supabase, saveProject, updateProject, deleteProject, getProjects } from '../lib/supabase';

interface ProjectStore {
  userCGIProjects: Project[];
  userRealProjects: Project[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  addProject: (project: Project, type: 'cgi' | 'real') => Promise<void>;
  updateProject: (project: Project, type: 'cgi' | 'real', index: number) => Promise<void>;
  deleteProject: (type: 'cgi' | 'real', index: number) => Promise<void>;
  fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      userCGIProjects: defaultCGIProjects,
      userRealProjects: defaultRealProjects,
      isLoading: false,
      error: null,
      initialized: false,
      
      addProject: async (project, type) => {
        set({ isLoading: true, error: null });
        try {
          // First, save to Supabase
          const savedProject = await saveProject({
            ...project,
            type: type.toUpperCase()
          }, type);
          
          if (!savedProject) {
            throw new Error('Failed to save project to Supabase');
          }

          // Then update local state
          set(state => ({
            userCGIProjects: type === 'cgi' 
              ? [...state.userCGIProjects, savedProject].sort((a, b) => {
                  const getLatestYear = (year: string) => {
                    const years = year.split('-');
                    return parseInt(years[years.length - 1]);
                  };
                  return getLatestYear(b.year) - getLatestYear(a.year);
                })
              : state.userCGIProjects,
            userRealProjects: type === 'real'
              ? [...state.userRealProjects, savedProject].sort((a, b) => {
                  const getLatestYear = (year: string) => {
                    const years = year.split('-');
                    return parseInt(years[years.length - 1]);
                  };
                  return getLatestYear(b.year) - getLatestYear(a.year);
                })
              : state.userRealProjects,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error adding project:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to add project';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },
      
      updateProject: async (project, type, index) => {
        set({ isLoading: true, error: null });
        try {
          const projects = type === 'cgi' ? get().userCGIProjects : get().userRealProjects;
          const projectToUpdate = projects[index];
          
          if (!projectToUpdate.id) {
            throw new Error('Project ID not found');
          }

          // Update in Supabase
          await updateProject({
            ...project,
            id: projectToUpdate.id,
            type: type.toUpperCase()
          }, projectToUpdate.id);
          
          // Update local state
          set(state => ({
            userCGIProjects: type === 'cgi'
              ? state.userCGIProjects.map((p, i) => i === index ? { ...project, id: projectToUpdate.id } : p)
              : state.userCGIProjects,
            userRealProjects: type === 'real'
              ? state.userRealProjects.map((p, i) => i === index ? { ...project, id: projectToUpdate.id } : p)
              : state.userRealProjects,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error updating project:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },
      
      deleteProject: async (type, index) => {
        set({ isLoading: true, error: null });
        try {
          const projects = type === 'cgi' ? get().userCGIProjects : get().userRealProjects;
          const projectToDelete = projects[index];
          
          if (!projectToDelete.id) {
            throw new Error('Project ID not found');
          }

          // Delete from Supabase
          await deleteProject(projectToDelete.id);
          
          // Update local state
          set(state => ({
            userCGIProjects: type === 'cgi'
              ? state.userCGIProjects.filter((_, i) => i !== index)
              : state.userCGIProjects,
            userRealProjects: type === 'real'
              ? state.userRealProjects.filter((_, i) => i !== index)
              : state.userRealProjects,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error deleting project:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },
      
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const [cgiProjects, realProjects] = await Promise.all([
            getProjects('CGI'),
            getProjects('REAL')
          ]);
          
          set({
            userCGIProjects: cgiProjects.length > 0 ? cgiProjects : defaultCGIProjects,
            userRealProjects: realProjects.length > 0 ? realProjects : defaultRealProjects,
            isLoading: false,
            initialized: true,
            error: null
          });
        } catch (error) {
          console.error('Error fetching projects:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
          set({ 
            isLoading: false, 
            error: errorMessage,
            initialized: true,
            userCGIProjects: defaultCGIProjects,
            userRealProjects: defaultRealProjects
          });
        }
      }
    }),
    {
      name: 'project-storage',
      version: 1,
      migrate: (persistedState: any) => {
        return {
          userCGIProjects: persistedState?.userCGIProjects || defaultCGIProjects,
          userRealProjects: persistedState?.userRealProjects || defaultRealProjects,
          isLoading: false,
          error: null,
          initialized: false
        };
      },
      partialize: (state) => ({
        userCGIProjects: state.userCGIProjects,
        userRealProjects: state.userRealProjects
      })
    }
  )
);