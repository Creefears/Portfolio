import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tool } from '../types/project';
import { getTools, saveTool, deleteTool } from '../lib/supabase';
import { toast } from '../components/ui/Toast';

interface ToolStore {
  tools: Tool[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  addTool: (tool: Tool) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  fetchTools: () => Promise<void>;
}

export const useToolStore = create<ToolStore>()(
  persist(
    (set, get) => ({
      tools: [],
      isLoading: false,
      error: null,
      initialized: false,

      addTool: async (tool: Tool) => {
        set({ isLoading: true, error: null });
        try {
          const savedTool = await saveTool(tool);
          set(state => ({
            tools: [...state.tools, savedTool],
            isLoading: false
          }));
          toast.success('Logiciel ajouté avec succès');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout du logiciel';
          console.error('Error adding tool:', error);
          set({ isLoading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      deleteTool: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await deleteTool(id);
          set(state => ({
            tools: state.tools.filter(tool => tool.id !== id),
            isLoading: false
          }));
          toast.success('Logiciel supprimé avec succès');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du logiciel';
          console.error('Error deleting tool:', error);
          set({ isLoading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      fetchTools: async () => {
        if (!get().initialized) {
          set({ isLoading: true, error: null });
          try {
            const tools = await getTools();
            set({
              tools,
              isLoading: false,
              initialized: true,
              error: null
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des logiciels';
            console.error('Error fetching tools:', error);
            set({ 
              isLoading: false, 
              error: errorMessage,
              initialized: true
            });
            toast.error(errorMessage);
          }
        }
      }
    }),
    {
      name: 'tool-storage',
      version: 1,
      partialize: (state) => ({
        tools: state.tools,
        initialized: state.initialized
      })
    }
  )
);