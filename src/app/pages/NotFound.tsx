import { Link } from 'react-router-dom';
import { useLang } from '/src/contexts/LanguageContext';

export default function NotFound() {
  const { lang } = useLang();
  const en = lang === 'en';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-[16px] px-[16px] text-center">
      <h1 className="font-bold text-[64px] tracking-[-0.02em]">404</h1>
      <p className="text-[18px]">{en ? 'Page not found' : 'Страница не найдена'}</p>
      <Link to="/" className="underline hover:opacity-60 transition-opacity">
        {en ? 'Back to home' : 'На главную'}
      </Link>
    </div>
  );
}
