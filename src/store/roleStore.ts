import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../types/role';
import { supabase } from '../lib/supabase';

const defaultRoles = [
  { name: 'Réalisateur', colors: { bg: 'bg-purple-100', text: 'text-purple-800' } },
  { name: 'Assistant Réalisateur', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } },
  { name: '1er Assistant Réalisateur', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } },
  { name: '2ème Assistant Réalisateur', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } },
  { name: 'Monteur Vidéo', colors: { bg: 'bg-green-100', text: 'text-green-800' } },
  { name: '1er Monteur Vidéo', colors: { bg: 'bg-green-100', text: 'text-green-800' } },
  { name: 'Chargé de Production', colors: { bg: 'bg-yellow-100', text: 'text-yellow-800' } },
  { name: 'Concepteur 3D', colors: { bg: 'bg-red-100', text: 'text-red-800' } },
  { name: 'Modeleur', colors: { bg: 'bg-red-100', text: 'text-red-800' } },
  { name: 'Animateur', colors: { bg: 'bg-red-100', text: 'text-red-800' } },
  { name: 'Intégrale', colors: { bg: 'bg-blue-100', text: 'text-blue-800' } }
];

interface RoleStore {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  addRole: (role: Role) => Promise<void>;
  updateRole: (role: Role) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  fetchRoles: () => Promise<void>;
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set, get) => ({
      roles: defaultRoles,
      isLoading: false,
      error: null,
      initialized: false,

      addRole: async (role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('roles')
            .insert([role])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            roles: [...state.roles, data],
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error adding role:', error);
          set({ isLoading: false, error: 'Failed to add role' });
          throw error;
        }
      },

      updateRole: async (role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('roles')
            .update(role)
            .eq('id', role.id)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            roles: state.roles.map(r => r.id === role.id ? data : r),
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error updating role:', error);
          set({ isLoading: false, error: 'Failed to update role' });
          throw error;
        }
      },

      deleteRole: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set(state => ({
            roles: state.roles.filter(role => role.id !== id),
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error deleting role:', error);
          set({ isLoading: false, error: 'Failed to delete role' });
          throw error;
        }
      },

      fetchRoles: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('name');

          if (error) throw error;

          // If no roles in database, use default roles
          const roles = data.length > 0 ? data : defaultRoles;

          set({
            roles,
            isLoading: false,
            initialized: true,
            error: null
          });
        } catch (error) {
          console.error('Error fetching roles:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to fetch roles',
            initialized: true,
            roles: defaultRoles // Fallback to default roles
          });
        }
      }
    }),
    {
      name: 'role-storage',
      version: 1
    }
  )
);