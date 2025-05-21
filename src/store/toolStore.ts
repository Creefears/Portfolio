import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tool } from '../types/project';
import { getTools, saveTool, deleteTool } from '../lib/supabase';

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
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add tool';
          console.error('Error adding tool:', error);
          set({ isLoading: false, error: errorMessage });
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
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete tool';
          console.error('Error deleting tool:', error);
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      fetchTools: async () => {
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
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tools';
          console.error('Error fetching tools:', error);
          set({ 
            isLoading: false, 
            error: errorMessage,
            initialized: true
          });
        }
      }
    }),
    {
      name: 'tool-storage',
      version: 1
    }
  )
);