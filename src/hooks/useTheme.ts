import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useMediaQuery } from './useMediaQuery';

export function useTheme() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    // Check if there's a stored theme preference
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, prefersDark]);

  const setTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toggleTheme();
  };

  return { isDarkMode, setTheme };
}