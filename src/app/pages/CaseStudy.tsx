import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '/src/config/api';

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
}

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current project
        const projectResponse = await fetch(API_ENDPOINTS.projectBySlug(slug!));
        const projectResult = await projectResponse.json();
        if (projectResult.success) {
          setProject(projectResult.data);
        }

        // Fetch all projects for navigation
        const allResponse = await fetch(API_ENDPOINTS.projects);
        const allResult = await allResponse.json();
        if (allResult.success) {
          setAllProjects(allResult.data);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#fcfcfc] size-full flex items-center justify-center">
        <p className="font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[24px]">Загрузка...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-[#fcfcfc] size-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['SF_Pro',sans-serif] text-[48px] font-bold text-[#000000] mb-4">
            Кейс не найден
          </h1>
          <Link 
            to="/"
            className="text-[#007AFF] hover:opacity-60 transition-opacity font-['SF_Pro',sans-serif] text-[20px]"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const index = allProjects.findIndex(p => p.slug === slug);

  return (
    <>
    <div className="bg-[#fcfcfc] min-h-screen overflow-y-auto">
      <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="bg-[#fcfcfc] flex items-center justify-between px-5 md:px-[120px] py-[16px] sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-[8px] text-[#000000] hover:opacity-60 transition-opacity"
        >
          <ChevronLeft className="size-[20px] md:size-[24px]" />
          <p className="font-['SF_Pro',sans-serif] font-normal text-[18px] md:text-[28px] tracking-[0.38px]">
            Назад
          </p>
        </button>
        <Link
          to="/"
          className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[18px] md:text-[28px] tracking-[0.38px]"
        >
          Alexander Petrov
        </Link>
      </div>

      {/* Hero Section */}
      <div className="px-5 md:px-[120px] py-[32px] md:py-[64px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-[16px] md:mb-[24px]">
            <h1 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[40px] md:text-[72px] leading-[1.1] tracking-[-1.5px] md:tracking-[-3px]">
              {project.title}
            </h1>
          </div>

          <div className="flex gap-[24px] md:gap-[48px] mb-[32px] md:mb-[48px]">
            <div>
              <p className="font-['SF_Pro',sans-serif] font-[590] text-[#9d9ea2] text-[13px] md:text-[17px] tracking-[-0.43px] mb-[4px] md:mb-[8px]">
                Продукт
              </p>
              <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[16px] md:text-[22px]">
                {project.product}
              </p>
            </div>
            <div>
              <p className="font-['SF_Pro',sans-serif] font-[590] text-[#9d9ea2] text-[13px] md:text-[17px] tracking-[-0.43px] mb-[4px] md:mb-[8px]">
                Платформа
              </p>
              <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[16px] md:text-[22px]">
                {project.platform}
              </p>
            </div>
          </div>

          {/* Hero Image */}
          {project.imageUrl && (
            <div className="rounded-[16px] md:rounded-[24px] overflow-hidden mb-[32px] md:mb-[64px] h-[240px] md:h-[479px]">
              <img
                alt={project.title}
                className="w-full h-full object-cover block"
                src={project.imageUrl}
              />
            </div>
          )}

          {/* Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[32px] md:gap-[48px]">
            <div className="col-span-1 md:col-span-8">
              {/* Challenge */}
              <section className="mb-[40px] md:mb-[64px]">
                <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[28px] md:text-[42px] tracking-[-0.5px] md:tracking-[-1px] mb-[16px] md:mb-[24px]">
                  Задача
                </h2>
                <p className="font-['Roboto',sans-serif] text-[#000000] text-[16px] md:text-[24px] leading-[1.6]">
                  {project.challenge}
                </p>
              </section>

              {/* Solution */}
              <section className="mb-[40px] md:mb-[64px]">
                <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[28px] md:text-[42px] tracking-[-0.5px] md:tracking-[-1px] mb-[16px] md:mb-[24px]">
                  Решение
                </h2>
                <p className="font-['Roboto',sans-serif] text-[#000000] text-[16px] md:text-[24px] leading-[1.6]">
                  {project.solution}
                </p>
              </section>

              {/* Images */}
              {project.caseImages && project.caseImages.length > 0 && (
                <section className="mb-[40px] md:mb-[64px]">
                  <div className="flex flex-col gap-[16px] md:gap-[24px]">
                    {project.caseImages.map((imageUrl, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="rounded-[16px] md:rounded-[24px] overflow-hidden w-full cursor-zoom-in"
                        onClick={() => setLightboxSrc(imageUrl)}
                      >
                        <img
                          alt={`${project.title} - скриншот ${imgIndex + 1}`}
                          className="w-full h-auto object-contain"
                          src={imageUrl}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-span-1 md:col-span-4 md:sticky md:top-[72px] md:self-start">
              {/* Results */}
              <div className="bg-[#f2f2f2] rounded-[16px] md:rounded-[24px] p-[20px] md:p-[32px] mb-[24px] md:mb-[32px]">
                <h3 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[22px] md:text-[28px] mb-[16px] md:mb-[24px]">
                  Результаты
                </h3>
                <ul className="space-y-[12px] md:space-y-[16px]">
                  {(project.results || []).map((result, idx) => (
                    <li key={idx} className="flex items-start gap-[10px] md:gap-[12px]">
                      <span className="text-[#007AFF] text-[18px] md:text-[24px] mt-[-2px] md:mt-[-4px]">✓</span>
                      <span className="font-['Roboto',sans-serif] text-[#000000] text-[15px] md:text-[20px] leading-[1.4]">
                        {result}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Next/Previous Projects */}
          <div className="border-t border-[#ccc] pt-[32px] md:pt-[48px] mt-[40px] md:mt-[64px]">
            <div className="flex justify-between items-center">
              <div>
                {index > 0 && (
                  <Link 
                    to={`/case/${allProjects[index - 1].slug}`}
                    className="group flex items-center gap-[12px] hover:opacity-60 transition-opacity"
                  >
                    <ChevronLeft className="size-[24px] text-[#000000]" />
                    <div>
                      <p className="font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[17px] mb-[4px]">
                        Предыдущий проект
                      </p>
                      <p className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[28px]">
                        {allProjects[index - 1].title}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
              <div>
                {index < allProjects.length - 1 && (
                  <Link 
                    to={`/case/${allProjects[index + 1].slug}`}
                    className="group flex items-center gap-[12px] hover:opacity-60 transition-opacity"
                  >
                    <div className="text-right">
                      <p className="font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[17px] mb-[4px]">
                        Следующий проект
                      </p>
                      <p className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[28px]">
                        {allProjects[index + 1].title}
                      </p>
                    </div>
                    <ChevronLeft className="size-[24px] text-[#000000] rotate-180" />
                  </Link>
                )}
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
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 md:p-8"
        onClick={() => setLightboxSrc(null)}
      >
        <img
          src={lightboxSrc}
          alt="Полный размер"
          className="max-w-full max-h-full object-contain rounded-[8px]"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={() => setLightboxSrc(null)}
          className="absolute top-4 right-4 text-white hover:opacity-60 transition-opacity text-[32px] leading-none"
        >
          ×
        </button>
      </div>
    )}
    </>
  );
}