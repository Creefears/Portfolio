import React from 'react';
import { useLanguageStore } from '../store/languageStore';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const toggle = () => setLanguage(language === 'fr' ? 'en' : 'fr');
  return (
    <button
      onClick={toggle}
      className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600"
    >
      {language === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
