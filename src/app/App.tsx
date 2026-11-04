import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CaseStudy from './pages/CaseStudy';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { LanguageProvider } from '/src/contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="size-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/case/:slug" element={<CaseStudy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}