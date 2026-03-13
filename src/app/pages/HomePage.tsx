import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, API_BASE_URL } from '/src/config/api';
import { cloudinaryOptimize } from '/src/utils/cloudinary';

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

const CACHE_TTL = 5 * 60 * 1000; // 5 минут

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data as T;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Показываем закешированные данные мгновенно
    const cachedProjects = readCache<Project[]>('hp_projects');
    const cachedProfile = readCache<Profile>('hp_profile');
    if (cachedProjects) { setProjects(cachedProjects); setLoading(false); }
    if (cachedProfile) setProfile(cachedProfile);

    fetchData(!!cachedProjects);
  }, []);

  const fetchData = async (hasCache = false) => {
    try {
      const [projectsResponse, profileResponse] = await Promise.all([
        fetch(API_ENDPOINTS.projects),
        fetch(API_ENDPOINTS.profile),
      ]);

      if (projectsResponse.ok) {
        const projectsResult = await projectsResponse.json();
        if (projectsResult.success) {
          const sorted = [...projectsResult.data].reverse();
          setProjects(sorted);
          writeCache('hp_projects', sorted);
        }
      }

      if (profileResponse.ok) {
        const profileResult = await profileResponse.json();
        if (profileResult.success) {
          setProfile(profileResult.data);
          writeCache('hp_profile', profileResult.data);
        }
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      if (!hasCache) { setProjects([]); setProfile({}); }
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gradient-to-br from-white to-[#f5f5f7] w-full min-h-screen">
      {/* Header — full width */}
      <div className="backdrop-blur-xl bg-white/70 border-b border-black/[0.06] sticky top-0 z-[10] w-full">
        <div className="flex items-center justify-between py-[16px] px-5 md:px-[120px] max-w-[1440px] mx-auto">
          <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[18px] md:text-[28px] tracking-[0.38px]">
            Alexander Petrov
          </p>
          <div className="flex font-['SF_Pro',sans-serif] font-normal gap-[16px] md:gap-[32px] items-start text-[#000000] text-[18px] md:text-[28px] tracking-[0.38px]">
            <button
              onClick={() => scrollToSection(casesRef)}
              className="cursor-pointer hover:opacity-60 transition-opacity"
            >
              Кейсы
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="cursor-pointer hover:opacity-60 transition-opacity"
            >
              Обо мне
            </button>
          </div>
        </div>
      </div>

    <div className="flex flex-col items-start px-5 md:px-[120px] max-w-[1440px] mx-auto w-full">
      {/* Main Content */}
      <div className="flex flex-col items-start py-[24px] md:py-[48px] relative shrink-0 w-full z-[1]">

        {/* Title Section */}
        <div ref={heroRef} className="flex flex-col-reverse md:flex-row gap-[24px] md:gap-[48px] items-center md:items-stretch py-[24px] md:py-[48px] relative shrink-0 w-full z-[3]">
          {/* Text */}
          <div className="flex flex-1 flex-col items-start w-full min-w-0 md:min-h-[416px]">
            <p className="font-['SF_Pro',sans-serif] font-bold leading-[1] md:leading-[100px] text-[#000000] text-[56px] md:text-[100px] tracking-[-1.5px] md:tracking-[-2px] w-full">
              Product Designer
            </p>
            <div className="flex flex-col gap-[4px] items-start text-[#000000] mt-[24px] md:mt-[32px]">
              <p className="font-['SF_Pro',sans-serif] font-bold text-[24px] md:text-[34px] tracking-[-0.5px]">
                Александр Петров
              </p>
              <p className="font-['SF_Pro',sans-serif] font-normal text-[16px] md:text-[22px] tracking-[-0.26px]">
                Москва, Россия
              </p>
            </div>
            <div className="flex gap-[12px] md:gap-[16px] items-start mt-auto pt-[24px]">
              <a
                href={profile.telegramUrl || "https://t.me/saneuuu"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/60 backdrop-blur-md flex gap-[8px] items-center justify-center px-[16px] md:px-[24px] py-[10px] md:py-[12px] rounded-[100px] hover:bg-white/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              >
                <svg className="shrink-0 size-[22px] md:size-[28px]" fill="none" viewBox="0 0 28 28">
                  <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="url(#paint0_linear)" />
                  <path d="M6.384 13.72C10.564 11.906 13.282 10.716 14.538 10.15C18.506 8.5 19.324 8.192 19.862 8.184C19.978 8.182 20.238 8.212 20.408 8.348C20.55 8.462 20.588 8.618 20.606 8.726C20.624 8.834 20.648 9.078 20.63 9.268C20.42 11.55 19.472 17.146 19.002 19.692C18.806 20.76 18.42 21.11 18.048 21.144C17.232 21.218 16.608 20.598 15.812 20.078C14.548 19.234 13.842 18.712 12.618 17.894C11.204 16.952 12.106 16.432 12.902 15.608C13.11 15.392 16.684 12.164 16.754 11.874C16.764 11.838 16.772 11.704 16.69 11.634C16.608 11.564 16.484 11.59 16.398 11.61C16.272 11.638 14.296 12.964 10.472 15.588C9.902 15.986 9.388 16.18 8.93 16.17C8.424 16.16 7.45 15.886 6.728 15.654C5.846 15.372 5.146 15.224 5.208 14.738C5.24 14.484 5.596 14.224 6.272 13.958L6.384 13.72Z" fill="white" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="1400" y1="0" x2="1400" y2="2800" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2AABEE" />
                      <stop offset="1" stopColor="#229ED9" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[15px] md:text-[17px] tracking-[-0.43px]">
                  Telegram
                </p>
              </a>
              <a
                href={profile.cvUrl ? `${API_BASE_URL}/api/download/cv` : "/cv.pdf"}
                download="CV.pdf"
                className="bg-white/60 backdrop-blur-md flex gap-[8px] items-center justify-center px-[16px] md:px-[24px] py-[10px] md:py-[12px] rounded-[100px] hover:bg-white/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              >
                <svg className="shrink-0 size-[22px] md:size-[28px]" fill="none" viewBox="0 0 28 28">
                  <path d="M14 2C7.372 2 2 7.372 2 14C2 20.628 7.372 26 14 26C20.628 26 26 20.628 26 14C26 7.372 20.628 2 14 2ZM14 8C14.552 8 15 8.448 15 9V14.586L17.293 12.293C17.684 11.902 18.316 11.902 18.707 12.293C19.098 12.684 19.098 13.316 18.707 13.707L14.707 17.707C14.512 17.902 14.256 18 14 18C13.744 18 13.488 17.902 13.293 17.707L9.293 13.707C8.902 13.316 8.902 12.684 9.293 12.293C9.684 11.902 10.316 11.902 10.707 12.293L13 14.586V9C13 8.448 13.448 8 14 8ZM9 19C8.448 19 8 19.448 8 20C8 20.552 8.448 21 9 21H19C19.552 21 20 20.552 20 20C20 19.448 19.552 19 19 19H9Z" fill="#000000" />
                </svg>
                <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[15px] md:text-[17px] tracking-[-0.43px]">
                  CV
                </p>
              </a>
            </div>
          </div>

          {/* Photo */}
          <div className="relative rounded-[28px] md:rounded-[48px] shrink-0 w-full md:w-[416px] h-[240px] md:h-[416px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            {loading && (
              <div className="absolute inset-0 bg-[#e8e8e8] animate-pulse" />
            )}
            <img
              alt="Александр Петров"
              className={`absolute inset-0 max-w-none object-cover pointer-events-none size-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
              src={cloudinaryOptimize(profile.photoUrl, 416) || "https://drive.google.com/uc?export=view&id=13vYeZ6qlWxU25Wn-TEacoarS5E64F1VF"}
              onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
            />
          </div>
        </div>

        {/* Projects Row */}
        <div ref={casesRef} className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[32px] py-[24px] md:py-[48px] relative shrink-0 w-full z-[2]">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-[12px] md:gap-[16px] w-full animate-pulse bg-white/50 rounded-[28px] p-5">
                  {/* Title line */}
                  <div className="pb-[12px] md:pb-[16px] border-b border-[#e8e8e8]">
                    <div className="h-[22px] md:h-[28px] bg-[#e8e8e8] rounded-[6px] w-3/4" />
                  </div>
                  {/* Meta */}
                  <div className="flex gap-[24px] md:gap-[42px]">
                    <div className="flex flex-col gap-[6px]">
                      <div className="h-[12px] bg-[#e8e8e8] rounded-[4px] w-[48px]" />
                      <div className="h-[16px] bg-[#e8e8e8] rounded-[4px] w-[80px]" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <div className="h-[12px] bg-[#e8e8e8] rounded-[4px] w-[56px]" />
                      <div className="h-[16px] bg-[#e8e8e8] rounded-[4px] w-[64px]" />
                    </div>
                  </div>
                  {/* Image placeholder */}
                  <div className="aspect-[3/2] rounded-[12px] bg-[#e8e8e8]" />
                </div>
              ))}
            </>
          ) : projects.length === 0 ? (
            <div className="w-full text-center py-[48px]">
              <p className="font-['SF_Pro',sans-serif] text-[#000000] text-[20px] md:text-[24px]">Проекты не найдены</p>
            </div>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                to={`/case/${project.slug}`}
                className="flex flex-col gap-[12px] md:gap-[16px] items-start w-full relative group cursor-pointer bg-white/50 backdrop-blur-sm border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-[28px] p-5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.10)] hover:bg-white/70 transition-all duration-300"
              >
                <div className="flex items-center pb-[12px] md:pb-[16px] relative shrink-0 w-full border-b border-black/[0.08] group-hover:border-black/20 transition-colors duration-300">
                  <p className="flex-1 font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[20px] md:text-[28px] text-ellipsis tracking-[0.38px] whitespace-nowrap overflow-hidden">
                    {project.title}
                  </p>
                </div>
                <div className="flex gap-[24px] md:gap-[42px] items-start shrink-0 w-full">
                  <div className="flex flex-col gap-[4px] items-start">
                    <p className="font-['SF_Pro',sans-serif] font-[590] text-[#9d9ea2] text-[13px] md:text-[17px] tracking-[-0.43px]">
                      Продукт
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[15px] md:text-[20px] tracking-[-0.45px]">
                      {project.product}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[4px] items-start">
                    <p className="font-['SF_Pro',sans-serif] font-[590] text-[#9d9ea2] text-[13px] md:text-[17px] tracking-[-0.43px]">
                      Платформа
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[15px] md:text-[20px] tracking-[-0.45px]">
                      {project.platform}
                    </p>
                  </div>
                </div>
                <div className="aspect-[3/2] relative rounded-[12px] w-full overflow-hidden">
                  {project.imageUrl ? (
                    <>
                      <img
                        alt={project.title}
                        className="absolute max-w-none object-cover size-full group-hover:scale-[1.02] transition-transform duration-300"
                        src={cloudinaryOptimize(project.imageUrl, 800)}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-[#f2f2f2] flex items-center justify-center">
                      <span className="font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[16px] md:text-[20px]">{project.title}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* About Me Section */}
        <div ref={aboutRef} className="flex flex-col font-normal gap-[24px] items-start py-[24px] md:py-[48px] relative shrink-0 text-black w-full z-[1]">
          <p className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[32px] md:text-[42px] tracking-[-0.5px] md:tracking-[-1px] leading-none">
            Обо мне
          </p>
          <div className="font-['Roboto',sans-serif] text-[#000000] text-[16px] md:text-[24px] leading-[1.4] md:leading-[1.2] max-w-[996px]">
            {profile.about ? (
              profile.about.split('\n\n').map((para, i, arr) => (
                <p key={i} className={i < arr.length - 1 ? 'mb-[24px] md:mb-[32px]' : ''}>
                  {para}
                </p>
              ))
            ) : (
              <>
                <p className="mb-[24px] md:mb-[32px]">Продуктовый дизайнер с фокусом на B2B e-commerce и внутренние сервисы. Проектирую сложные сценарии с высокой бизнес-нагрузкой и помогаю командам принимать решения на основе данных.</p>
                <p className="mb-[24px] md:mb-[32px]">Работаю по полному циклу: от исследования и формирования гипотез до прототипирования, запуска и итераций на основе метрик. Участвую в discovery, приоритизации задач и формировании roadmap вместе с PM и аналитикой.</p>
                <p>Использую аналитику, интервью и A/B-тесты, чтобы улучшать продукт измеримо. Выстраиваю дизайн-системы, веду design review и слежу за качеством реализации.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
