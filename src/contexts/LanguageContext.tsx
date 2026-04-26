import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'ru' | 'en';

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ru',
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('lang') as Lang) || 'ru';
    } catch {
      return 'ru';
    }
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggle = () => setLang(prev => (prev === 'ru' ? 'en' : 'ru'));

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
