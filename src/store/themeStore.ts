import { create } from 'zustand';

type ThemeStore = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: true, // Set dark mode as default
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));