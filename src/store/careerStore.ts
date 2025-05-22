import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface CareerState {
  experiences: any[];
  loading: boolean;
  error: string | null;
  fetchExperiences: () => Promise<void>;
}

export const useCareerStore = create<CareerState>((set) => ({
  experiences: [],
  loading: false,
  error: null,
  fetchExperiences: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ experiences: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));