import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[language as 'fr' | 'en'];
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) return path;
    }
    return result as string;
  };

  return { t, language };
}
