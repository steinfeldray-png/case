import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '/src/config/api';

interface Project {
  id: number;
  slug: string;
  title: string;
  product: string;
  platform: string;
  description: string;
  year: string;
  imageUrl?: string;
}

interface Profile {
  photoUrl?: string;
  name?: string;
  about?: string;
  telegramUrl?: string;
  cvUrl?: string;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Загрузка данных с API:', API_ENDPOINTS.projects);
      
      // Fetch projects
      const projectsResponse = await fetch(API_ENDPOINTS.projects);
      
      if (!projectsResponse.ok) {
        console.error('❌ Projects response not ok:', projectsResponse.status);
        // Continue even if projects fail
      } else {
        const projectsResult = await projectsResponse.json();
        console.log('✅ Projects loaded:', projectsResult);
        if (projectsResult.success) {
          setProjects(projectsResult.data);
        }
      }

      // Fetch profile
      const profileResponse = await fetch(API_ENDPOINTS.profile);
      
      if (!profileResponse.ok) {
        console.error('❌ Profile response not ok:', profileResponse.status);
        // Continue even if profile fails
      } else {
        const profileResult = await profileResponse.json();
        console.log('✅ Profile loaded:', profileResult);
        if (profileResult.success) {
          setProfile(profileResult.data);
        }
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      console.error('📍 Убедитесь что backend запущен на:', API_ENDPOINTS.projects);
      // Set empty data instead of breaking
      setProjects([]);
      setProfile({});
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#fffbfa] content-stretch flex flex-col isolate items-start px-[48px] relative size-full overflow-y-auto">
      {/* Header */}
      <div className="bg-[#fffbfa] content-stretch flex items-center justify-between py-[16px] relative shrink-0 w-full z-[2] sticky top-0">
        <p className="font-['SF_Pro',sans-serif] font-normal leading-[34px] relative shrink-0 text-[#281d1b] text-[28px] tracking-[0.38px]">
          Alexander Petrov
        </p>
        <div className="content-stretch flex font-['SF_Pro',sans-serif] font-normal gap-[32px] items-start leading-[34px] relative shrink-0 text-[#281d1b] text-[28px] tracking-[0.38px]">
          <button 
            onClick={() => scrollToSection(casesRef)}
            className="relative shrink-0 cursor-pointer hover:opacity-60 transition-opacity"
          >
            Кейсы
          </button>
          <button 
            onClick={() => scrollToSection(aboutRef)}
            className="relative shrink-0 cursor-pointer hover:opacity-60 transition-opacity"
          >
            Обо мне
          </button>
          <Link 
            to="/admin"
            className="relative shrink-0 cursor-pointer hover:opacity-60 transition-opacity text-[#007AFF]"
          >
            Админка
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-stretch flex flex-col isolate items-start py-[48px] relative shrink-0 w-full z-[1]">
        {/* Title Section */}
        <div className="bg-[#fffbfa] content-stretch flex gap-[48px] items-center py-[48px] relative shrink-0 w-full z-[3]">
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-h-px min-w-px relative">
              <p className="font-['SF_Pro',sans-serif] font-bold leading-[100px] relative shrink-0 text-[#281d1b] text-[100px] tracking-[0.4px] w-full whitespace-pre-wrap">
                Product Designer
              </p>
              <div className="content-stretch flex gap-[12px] items-end relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative text-[#281d1b]">
                  <p className="font-['SF_Pro',sans-serif] font-bold leading-[41px] relative shrink-0 text-[34px] tracking-[0.4px]">
                    Александр Петров
                  </p>
                  <p className="font-['SF_Pro',sans-serif] font-normal leading-[28px] relative shrink-0 text-[22px] tracking-[-0.26px]">
                    Москва, Россия
                  </p>
                </div>
                <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
                  <a
                    href={profile.telegramUrl || "https://t.me/saneuuu"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#fffbfa] content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative rounded-[100px] shrink-0 hover:bg-[#f5f0ef] transition-colors cursor-pointer border border-[rgba(120,120,128,0.16)] border-solid"
                  >
                    <svg className="relative shrink-0 size-[28px]" fill="none" viewBox="0 0 28 28">
                      <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="url(#paint0_linear)" />
                      <path d="M6.384 13.72C10.564 11.906 13.282 10.716 14.538 10.15C18.506 8.5 19.324 8.192 19.862 8.184C19.978 8.182 20.238 8.212 20.408 8.348C20.55 8.462 20.588 8.618 20.606 8.726C20.624 8.834 20.648 9.078 20.63 9.268C20.42 11.55 19.472 17.146 19.002 19.692C18.806 20.76 18.42 21.11 18.048 21.144C17.232 21.218 16.608 20.598 15.812 20.078C14.548 19.234 13.842 18.712 12.618 17.894C11.204 16.952 12.106 16.432 12.902 15.608C13.11 15.392 16.684 12.164 16.754 11.874C16.764 11.838 16.772 11.704 16.69 11.634C16.608 11.564 16.484 11.59 16.398 11.61C16.272 11.638 14.296 12.964 10.472 15.588C9.902 15.986 9.388 16.18 8.93 16.17C8.424 16.16 7.45 15.886 6.728 15.654C5.846 15.372 5.146 15.224 5.208 14.738C5.24 14.484 5.596 14.224 6.272 13.958L6.384 13.72Z" fill="white" />
                      <defs>
                        <linearGradient id="paint0_linear" x1="1400" y1="0" x2="1400" y2="2800" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#2AABEE" />
                          <stop offset="1" stopColor="#229ED9" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <p className="font-['SF_Pro',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#281d1b] text-[17px] tracking-[-0.43px]">
                      Telegram
                    </p>
                  </a>
                  <a
                    href={profile.cvUrl || "/cv.pdf"}
                    download
                    className="bg-[#fffbfa] content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative rounded-[100px] shrink-0 hover:bg-[#f5f0ef] transition-colors cursor-pointer border border-[rgba(120,120,128,0.16)] border-solid"
                  >
                    <svg className="relative shrink-0 size-[28px]" fill="none" viewBox="0 0 28 28">
                      <path d="M14 2C7.372 2 2 7.372 2 14C2 20.628 7.372 26 14 26C20.628 26 26 20.628 26 14C26 7.372 20.628 2 14 2ZM14 8C14.552 8 15 8.448 15 9V14.586L17.293 12.293C17.684 11.902 18.316 11.902 18.707 12.293C19.098 12.684 19.098 13.316 18.707 13.707L14.707 17.707C14.512 17.902 14.256 18 14 18C13.744 18 13.488 17.902 13.293 17.707L9.293 13.707C8.902 13.316 8.902 12.684 9.293 12.293C9.684 11.902 10.316 11.902 10.707 12.293L13 14.586V9C13 8.448 13.448 8 14 8ZM9 19C8.448 19 8 19.448 8 20C8 20.552 8.448 21 9 21H19C19.552 21 20 20.552 20 20C20 19.448 19.552 19 19 19H9Z" fill="#281d1b" />
                    </svg>
                    <p className="font-['SF_Pro',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#281d1b] text-[17px] tracking-[-0.43px]">
                      CV
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-[42px] shrink-0 size-[416px] overflow-hidden">
            <img 
              alt="Александр Петров" 
              className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[42px] size-full" 
              src={profile.photoUrl || "https://drive.google.com/uc?export=view&id=13vYeZ6qlWxU25Wn-TEacoarS5E64F1VF"}
            />
          </div>
        </div>

        {/* Projects Row */}
        <div ref={casesRef} className="bg-[#fffbfa] content-start flex flex-wrap gap-[48px] items-start overflow-clip py-[48px] relative shrink-0 w-full z-[2]">
          {loading ? (
            <div className="w-full text-center py-[48px]">
              <p className="font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[24px]">Загрузка проектов...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="w-full text-center py-[48px]">
              <p className="font-['SF_Pro',sans-serif] text-[#281d1b] text-[24px]">Проекты не найдены</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <Link 
                key={project.id}
                to={`/case/${project.slug}`}
                className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-[548px] items-start min-h-px min-w-[648px] relative group cursor-pointer"
              >
                <div className="content-stretch flex items-center pb-[16px] relative shrink-0 w-full border-b border-[#ccc] border-solid group-hover:border-[#281d1b] transition-colors duration-300">
                  <p className="flex-[1_0_0] font-['SF_Pro',sans-serif] font-normal leading-[34px] min-h-px min-w-px overflow-hidden relative text-[#281d1b] text-[28px] text-ellipsis tracking-[0.38px] whitespace-nowrap">
                    {project.title}
                  </p>
                </div>
                <div className="content-stretch flex gap-[42px] items-start leading-[0] relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                    <p className="font-['SF_Pro',sans-serif] font-[590] leading-[22px] text-[#9d9ea2] text-[17px] tracking-[-0.43px]">
                      Продукт
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-normal leading-[25px] text-[#281d1b] text-[20px] tracking-[-0.45px]">
                      {project.product}
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                    <p className="font-['SF_Pro',sans-serif] font-[590] leading-[22px] text-[#9d9ea2] text-[17px] tracking-[-0.43px]">
                      Платформа
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-normal leading-[25px] text-[#281d1b] text-[20px] tracking-[-0.45px]">
                      {project.platform}
                    </p>
                  </div>
                </div>
                <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[24px] w-full overflow-hidden">
                  <img 
                    alt={project.title}
                    className="absolute max-w-none object-cover rounded-[24px] size-full group-hover:scale-[1.02] transition-transform duration-300" 
                    src={project.imageUrl || `https://images.unsplash.com/photo-${1460925895917 + index * 1000}-${index === 0 ? '15a4b203' : index === 1 ? '2a7b7b2c' : index === 2 ? '3c8d8d3d' : '4e9e9e4e'}-${(index + 1) * 12345}a?w=800&h=600&fit=crop`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* About Me Section */}
        <div ref={aboutRef} className="content-stretch flex font-normal gap-[24px] items-start py-[48px] relative shrink-0 text-black w-full z-[1]">
          <div className="flex flex-col font-['SF_Pro',sans-serif] justify-center leading-[0] relative shrink-0 text-[42px] tracking-[0.4px] w-[324px]">
            <p className="leading-none whitespace-pre-wrap">Обо мне</p>
          </div>
          <div className="flex flex-[1_0_0] flex-col font-['Roboto',sans-serif] justify-center leading-[1.2] min-h-px min-w-px relative text-[24px] whitespace-pre-wrap">
            {profile.about ? (
              <div dangerouslySetInnerHTML={{ __html: profile.about.replace(/\n/g, '<br />') }} />
            ) : (
              <>
                <p className="mb-[32px]">Продуктовый дизайнер с опытом в B2B e-commerce и внутренних сервисах. Проектирую сложные сценарии с высокой бизнес-нагрузкой.</p>
                <p className="mb-[32px]">Работаю по end-to-end циклу: исследование - гипотезы - прототипирование - запуск - аналитика - итерации. Принимаю решения на основе исследований и бизнес-метрик.</p>
                
                <h3 className="font-bold text-[28px] mt-[40px] mb-[16px]">Soft Skills</h3>
                <ul className="list-disc pl-[24px] mb-[32px] space-y-[8px]">
                  <li>Сильное продуктовое мышление, ориентация на метрики и impact;</li>
                  <li>Работа в кросс-функциональных командах (PM, аналитика, разработка);</li>
                  <li>Умение аргументровать и защищать решения;</li>
                  <li>Участие в discovery, приоритизации и формировании roadmap;</li>
                  <li>Системность, структурность, самостоятельность.</li>
                </ul>
                
                <h3 className="font-bold text-[28px] mt-[24px] mb-[16px]">Hard Skills</h3>
                <ul className="list-disc pl-[24px] space-y-[8px]">
                  <li>Проектирование сложных интерфейсов;</li>
                  <li>Оптимизация пользовательских сценариев с измеримым результатом;</li>
                  <li>Проведение интервью, A/B-тестов, юзабилити-исследований, количественных исследований;</li>
                  <li>Low-fi / High-fi прототипирование;</li>
                  <li>Работа с дизайн-системами: развитие, документация, масштабирование;</li>
                  <li>Подготовка UI к разработке и контроль реализации (design review);</li>
                  <li>Работа с аналитикой (GA, Яндекс.Метрика);</li>
                  <li>Базовый HTML/CSS.</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}