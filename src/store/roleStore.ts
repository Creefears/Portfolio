import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../types/role';
import { getRoles, saveRole, deleteRole } from '../lib/supabase';

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
      roles: [],
      isLoading: false,
      error: null,
      initialized: false,

      addRole: async (role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const savedRole = await saveRole(role);
          set(state => ({
            roles: [...state.roles, savedRole],
            isLoading: false,
            error: null
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add role';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      updateRole: async (role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const updatedRole = await saveRole(role);
          set(state => ({
            roles: state.roles.map(r => r.id === role.id ? updatedRole : r),
            isLoading: false,
            error: null
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update role';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      deleteRole: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await deleteRole(id);
          set(state => ({
            roles: state.roles.filter(role => role.id !== id),
            isLoading: false,
            error: null
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete role';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      fetchRoles: async () => {
        set({ isLoading: true, error: null });
        try {
          const roles = await getRoles();
          set({
            roles,
            isLoading: false,
            initialized: true,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch roles';
          set({ 
            isLoading: false, 
            error: errorMessage,
            initialized: true
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