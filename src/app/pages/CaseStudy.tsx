import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ChevronLeft } from 'lucide-react';
import { useLang } from '/src/contexts/LanguageContext';
import { t } from '/src/i18n/translations';

// Если текст сохранён без HTML-тегов — конвертируем переносы строк в <br>
// Если уже содержит HTML (от WYSIWYG редактора) — оставляем как есть
const toHtml = (text: string): string => {
  if (!text) return '';
  if (/<[a-z]/i.test(text)) return text; // уже HTML
  return text.replace(/\n/g, '<br>');
};
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '/src/config/api';
import { cloudinaryOptimize } from '/src/utils/cloudinary';

interface Project {
  id: number;
  slug: string;
  title: string;
  product: string;
  platform: string;
  description: string;
  year: string;
  challenge: string;
  solution: string;
  results: string[];
  tags: string[];
  imageUrl?: string;
  caseImages?: string[];
  titleEn?: string;
  productEn?: string;
  platformEn?: string;
  challengeEn?: string;
  solutionEn?: string;
  resultsEn?: string[];
}

export default function CaseStudy() {
  const { lang, toggle } = useLang();
  const tr = t[lang];
  const loc = (ru: string, en?: string) => lang === 'en' && en ? en : ru;
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'skeleton-in' | 'skeleton' | 'skeleton-out' | 'content-in' | 'content'>('skeleton-in');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Skeleton fade-in on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('skeleton'));
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();
      try {
        const projectResponse = await fetch(API_ENDPOINTS.projectBySlug(slug!));
        const projectResult = await projectResponse.json();
        if (projectResult.success) setProject(projectResult.data);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 1000 - elapsed);
        setTimeout(() => {
          // Start skeleton fade-out
          setPhase('skeleton-out');
          setTimeout(() => {
            setLoading(false);
            // Content starts invisible, then fades in
            setPhase('content-in');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => setPhase('content'));
            });
          }, 150);
        }, remaining);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white h-screen overflow-y-auto" style={{
        opacity: phase === 'skeleton-in' ? 0 : phase === 'skeleton-out' ? 0 : 1,
        transition: 'opacity 150ms ease',
      }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-white/80 backdrop-blur-2xl border-b border-black/[0.08] flex items-center justify-between px-5 md:px-[120px] py-[16px] sticky top-0 z-10">
            <div className="h-[28px] w-[80px] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
          </div>
          <div className="px-5 md:px-[120px] py-[32px] md:py-[64px]">
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-[24px] space-y-[12px]">
                <div className="h-[56px] md:h-[72px] w-[70%] bg-[#f0f0f0] rounded-[12px] animate-pulse" />
                <div className="h-[56px] md:h-[72px] w-[40%] bg-[#f0f0f0] rounded-[12px] animate-pulse" />
              </div>
              <div className="flex gap-[48px] mb-[48px]">
                <div className="space-y-[8px]">
                  <div className="h-[14px] w-[60px] bg-[#f0f0f0] rounded-[6px] animate-pulse" />
                  <div className="h-[22px] w-[100px] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                </div>
                <div className="space-y-[8px]">
                  <div className="h-[14px] w-[60px] bg-[#f0f0f0] rounded-[6px] animate-pulse" />
                  <div className="h-[22px] w-[120px] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                </div>
              </div>
              <div className="rounded-[28px] h-[240px] md:h-[479px] bg-white/30 animate-pulse mb-[64px]" />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-[48px]">
                <div className="col-span-8 space-y-[64px]">
                  <div className="space-y-[16px]">
                    <div className="h-[42px] w-[140px] bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    <div className="h-[20px] w-full bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                    <div className="h-[20px] w-[90%] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                    <div className="h-[20px] w-[75%] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                  </div>
                  <div className="space-y-[16px]">
                    <div className="h-[42px] w-[160px] bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    <div className="h-[20px] w-full bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                    <div className="h-[20px] w-[85%] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                    <div className="h-[20px] w-[80%] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                    <div className="h-[20px] w-[60%] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-[28px] p-[32px] space-y-[16px]">
                    <div className="h-[28px] w-[120px] bg-[#f0f0f0] rounded-[8px] animate-pulse" />
                    <div className="h-[18px] w-full bg-[#f0f0f0] rounded-[6px] animate-pulse" />
                    <div className="h-[18px] w-[80%] bg-[#f0f0f0] rounded-[6px] animate-pulse" />
                    <div className="h-[18px] w-[90%] bg-[#f0f0f0] rounded-[6px] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white size-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['SF_Pro',sans-serif] text-[48px] font-bold text-[#000000] mb-4">
            {tr.case_not_found}
          </h1>
          <Link
            to="/"
            className="text-[#007AFF] hover:opacity-60 transition-opacity font-['SF_Pro',sans-serif] text-[20px]"
          >
            {tr.back_home}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white h-screen overflow-y-auto" style={{
      opacity: phase === 'content' ? 1 : 0,
      transition: 'opacity 150ms ease',
    }}>
      <div className="max-w-[1440px] mx-auto">
      {/* Header — glass */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-black/[0.08] flex items-center justify-between px-5 md:px-[120px] py-[16px] sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-[8px] text-[#000000] hover:opacity-60 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="size-[20px] md:size-[24px]" />
          <p className="font-['SF_Pro',sans-serif] font-normal text-[18px] md:text-[28px] tracking-[0.38px]">
            {tr.nav_back}
          </p>
        </button>
        <button
          onClick={toggle}
          className="flex items-center gap-[4px] font-['SF_Pro',sans-serif] text-[14px] md:text-[16px] tracking-[0.02em] cursor-pointer select-none"
        >
          <span className={lang === 'ru' ? 'text-[#000000] font-medium' : 'text-[#8e8e93]'}>RU</span>
          <span className="text-[#c7c7cc]">·</span>
          <span className={lang === 'en' ? 'text-[#000000] font-medium' : 'text-[#8e8e93]'}>EN</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="px-5 md:px-[120px] py-[32px] md:py-[64px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-[16px] md:mb-[24px]">
            <h1 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[40px] md:text-[72px] leading-[1.1] tracking-[-1.5px] md:tracking-[-3px]">
              {loc(project.title, project.titleEn)}
            </h1>
          </div>

          <div className="flex gap-[24px] md:gap-[48px] mb-[32px] md:mb-[48px]">
            <div>
              <p className="font-['SF_Pro',sans-serif] font-[590] text-[#6e6e73] text-[13px] md:text-[17px] tracking-[-0.43px] mb-[4px] md:mb-[8px]">
                {tr.label_product}
              </p>
              <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[16px] md:text-[22px]">
                {loc(project.product, project.productEn)}
              </p>
            </div>
            <div>
              <p className="font-['SF_Pro',sans-serif] font-[590] text-[#6e6e73] text-[13px] md:text-[17px] tracking-[-0.43px] mb-[4px] md:mb-[8px]">
                {tr.label_platform}
              </p>
              <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[16px] md:text-[22px]">
                {loc(project.platform, project.platformEn)}
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[32px] md:gap-[48px]">
            <div className="col-span-1 md:col-span-8">
              {/* Challenge */}
              <section className="mb-[40px] md:mb-[64px]">
                <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[28px] md:text-[42px] tracking-[-0.5px] md:tracking-[-1px] mb-[16px] md:mb-[24px]">
                  {tr.section_challenge}
                </h2>
                <div
                  className="font-['SF_Pro',sans-serif] text-[#000000] text-[16px] md:text-[24px] leading-[1.6] [&_h2]:font-bold [&_h2]:text-[22px] [&_h2]:md:text-[32px] [&_h2]:mb-[12px] [&_h2]:mt-[24px] [&_ul]:list-disc [&_ul]:pl-[24px] [&_ul]:space-y-[8px] [&_a]:text-[#007AFF] [&_a]:underline [&_b]:font-bold [&_i]:italic"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHtml(loc(project.challenge, project.challengeEn)), { FORBID_ATTR: ['style', 'class', 'color', 'face', 'size'] }) }}
                />
              </section>

              {/* Solution */}
              <section className="mb-[40px] md:mb-[64px]">
                <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[28px] md:text-[42px] tracking-[-0.5px] md:tracking-[-1px] mb-[16px] md:mb-[24px]">
                  {tr.section_solution}
                </h2>
                <div
                  className="font-['SF_Pro',sans-serif] text-[#000000] text-[16px] md:text-[24px] leading-[1.6] [&_h2]:font-bold [&_h2]:text-[22px] [&_h2]:md:text-[32px] [&_h2]:mb-[12px] [&_h2]:mt-[24px] [&_ul]:list-disc [&_ul]:pl-[24px] [&_ul]:space-y-[8px] [&_a]:text-[#007AFF] [&_a]:underline [&_b]:font-bold [&_i]:italic"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHtml(loc(project.solution, project.solutionEn)), { FORBID_ATTR: ['style', 'class', 'color', 'face', 'size'] }) }}
                />
              </section>

              {/* Images */}
              {project.caseImages && project.caseImages.length > 0 && (
                <section className="mb-[40px] md:mb-[64px]">
                  <div className="flex flex-col gap-[16px] md:gap-[24px]">
                    {project.caseImages.map((imageUrl, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="rounded-[20px] md:rounded-[28px] overflow-hidden w-full cursor-zoom-in shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-white/20"
                        onClick={() => setLightboxSrc(imageUrl)}
                      >
                        <img
                          alt={`${project.title} - скриншот ${imgIndex + 1}`}
                          className="w-full h-auto object-contain"
                          src={cloudinaryOptimize(imageUrl, 1200)}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar — glass panel */}
            <div className="col-span-1 md:col-span-4 md:sticky md:top-[104px] md:self-start">
              <div className="bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-[20px] md:rounded-[28px] p-[16.67px] md:p-[16.67px] mb-[24px] md:mb-[32px]">
                <h3 className="font-['SF_Pro',sans-serif] font-medium text-[#000000] text-[22px] md:text-[28px] mb-[16px] md:mb-[24px]">
                  {tr.section_results}
                </h3>
                <ul className="space-y-[12px] md:space-y-[16px]">
                  {(lang === 'en' && project.resultsEn?.length ? project.resultsEn : project.results || []).map((result, idx) => (
                    <li key={idx} className="flex items-start gap-[10px] md:gap-[12px]">
                      <span className="text-[#007AFF] text-[18px] md:text-[24px] mt-[-2px] md:mt-[-4px]">✓</span>
                      <span className="font-['SF_Pro',sans-serif] text-[#000000] text-[15px] md:text-[20px] leading-[1.4]">
                        {result}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>

    {/* Lightbox */}
    {lightboxSrc && (
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
        onClick={() => setLightboxSrc(null)}
      >
        <img
          src={lightboxSrc}
          alt={tr.img_fullsize}
          className="max-w-full max-h-full object-contain rounded-[16px] ring-1 ring-white/10"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={() => setLightboxSrc(null)}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors text-[32px] leading-none"
        >
          ×
        </button>
      </div>
    )}
    </>
  );
}
