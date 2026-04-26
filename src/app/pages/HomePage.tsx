import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, API_BASE_URL } from '/src/config/api';
import { cloudinaryOptimize } from '/src/utils/cloudinary';
import { useLang } from '/src/contexts/LanguageContext';
import { t } from '/src/i18n/translations';

interface Project {
  id: number;
  slug: string;
  title: string;
  product: string;
  platform: string;
  description: string;
  year: string;
  imageUrl?: string;
  inProgress?: boolean;
}

interface Profile {
  photoUrl?: string;
  name?: string;
  about?: string;
  telegramUrl?: string;
  cvUrl?: string;
}

const CACHE_TTL = 30 * 1000; // 30 секунд — только для защиты от лишних запросов при навигации

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
  const { lang, toggle } = useLang();
  const tr = t[lang];
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cachedProjects = readCache<Project[]>('hp_projects');
    const cachedProfile = readCache<Profile>('hp_profile');
    if (cachedProjects) setProjects(cachedProjects);
    if (cachedProfile) setProfile(cachedProfile);

    fetchData(!!cachedProjects);
  }, []);

  const fetchData = async (hasCache = false, attempt = 0) => {
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
      console.error('Error loading data:', error);
      // Render cold start — retry up to 3 times with delay
      if (attempt < 3) {
        setTimeout(() => fetchData(hasCache, attempt + 1), 3000);
        return;
      }
      if (!hasCache) { setProjects([]); setProfile({}); }
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white w-full min-h-screen">
      {/* Header — glass panel */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-black/[0.08] sticky top-0 z-[10] w-full">
        <div className="flex items-center justify-between py-[16px] px-5 md:px-[120px] max-w-[1440px] mx-auto">
          <svg className="size-[32px] md:size-[40px] shrink-0" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="500" height="500" rx="120" fill="black"/>
            <path d="M254.206 344.343C232.958 344.343 214.691 342.075 199.406 337.54C184.205 333.005 172.153 326.37 163.251 317.636C154.433 308.817 149.1 298.025 147.252 285.26L147 283.496H207.343L207.595 284.378C208.519 288.073 210.954 291.223 214.901 293.826C218.849 296.43 224.182 298.403 230.9 299.747C237.619 301.091 245.64 301.763 254.962 301.763C262.521 301.763 268.987 301.133 274.362 299.873C279.737 298.529 283.895 296.682 286.834 294.33C289.773 291.979 291.243 289.207 291.243 286.016V285.89C291.243 281.858 289.438 278.919 285.826 277.071C282.299 275.14 276 273.67 266.93 272.662L220.57 269.387C197.475 267.287 180.132 261.828 168.542 253.01C157.036 244.107 151.283 231.762 151.283 215.973V215.721C151.283 203.039 155.146 192.163 162.873 183.093C170.6 174.022 181.686 167.094 196.131 162.307C210.576 157.436 227.793 155 247.781 155C267.854 155 285.07 157.226 299.432 161.677C313.877 166.128 325.257 172.595 333.571 181.077C341.886 189.56 346.967 199.848 348.814 211.941L349.192 214.461H288.85L288.598 213.453C287.758 209.926 285.7 207.028 282.425 204.761C279.149 202.409 274.656 200.646 268.945 199.47C263.318 198.21 256.558 197.58 248.663 197.58C240.937 197.58 234.47 198.168 229.263 199.344C224.14 200.436 220.276 202.073 217.673 204.257C215.153 206.356 213.894 208.876 213.894 211.815V211.941C213.894 215.805 215.825 218.744 219.688 220.76C223.552 222.691 230.019 224.119 239.089 225.043L286.456 228.444C301.573 229.872 314.129 232.728 324.123 237.011C334.117 241.21 341.592 246.963 346.547 254.27C351.502 261.576 353.979 270.521 353.979 281.103V281.229C353.979 294.33 350.032 305.626 342.138 315.116C334.243 324.522 322.821 331.745 307.872 336.784C293.007 341.823 275.118 344.343 254.206 344.343Z" fill="white"/>
          </svg>
          <div className="flex font-['SF_Pro',sans-serif] font-normal gap-[16px] md:gap-[32px] items-center text-[#000000] text-[18px] md:text-[28px] tracking-[0.38px]">
            <button
              onClick={() => scrollToSection(casesRef)}
              className="cursor-pointer hover:opacity-60 transition-opacity"
            >
              {tr.nav_cases}
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="cursor-pointer hover:opacity-60 transition-opacity"
            >
              {tr.nav_about}
            </button>
            <button
              onClick={toggle}
              className="flex items-center gap-[4px] text-[14px] md:text-[16px] tracking-[0.02em] cursor-pointer select-none"
            >
              <span className={lang === 'ru' ? 'text-[#000000] font-medium' : 'text-[#8e8e93]'}>RU</span>
              <span className="text-[#c7c7cc]">·</span>
              <span className={lang === 'en' ? 'text-[#000000] font-medium' : 'text-[#8e8e93]'}>EN</span>
            </button>
          </div>
        </div>
      </div>

    <div className="flex flex-col items-start px-5 md:px-[120px] max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col items-start py-[24px] md:py-[48px] relative shrink-0 w-full z-[1]">

        {/* Title Section */}
        <div ref={heroRef} className="flex flex-col-reverse md:flex-row gap-[24px] md:gap-[48px] items-center md:items-stretch py-[24px] md:py-[48px] relative shrink-0 w-full z-[3]">
          {/* Text */}
          <div className="flex flex-1 flex-col items-start w-full min-w-0 md:min-h-[416px]">
            <p className="font-['SF_Pro',sans-serif] font-[1000] [font-stretch:130%] leading-[1] md:leading-[100px] text-[#000000] text-[56px] md:text-[100px] tracking-[-1.5px] md:tracking-[-2px] w-full">
              Product Designer
            </p>
            <div className="flex flex-col gap-[4px] items-start text-[#000000] mt-[24px] md:mt-[32px]">
              <p className="font-['SF_Pro',sans-serif] font-bold text-[24px] md:text-[34px] tracking-[-0.5px]">
                Александр Петров
              </p>
              <p className="font-['SF_Pro',sans-serif] font-normal text-[16px] md:text-[22px] tracking-[-0.26px]">
                {tr.location}
              </p>
            </div>
            <div className="flex gap-[12px] md:gap-[16px] items-start mt-auto pt-[24px]">
              <a
                href={profile.telegramUrl || "https://t.me/saneuuu"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white flex gap-[8px] items-center justify-center px-[16px] md:px-[24px] py-[10px] md:py-[12px] rounded-[100px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#d1d1d6] hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-[#e5e5ea]/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
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
              <button
                type="button"
                onClick={async () => {
                  const url = profile.cvUrl || '/cv.pdf';
                  try {
                    const res = await fetch(url);
                    const blob = await res.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = 'CV.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                  } catch {
                    window.open(url, '_blank');
                  }
                }}
                className="bg-white flex gap-[8px] items-center justify-center px-[16px] md:px-[24px] py-[10px] md:py-[12px] rounded-[100px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#d1d1d6] hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-[#e5e5ea]/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <svg className="shrink-0 size-[22px] md:size-[28px]" fill="none" viewBox="0 0 28 28">
                  <path d="M14 2C7.372 2 2 7.372 2 14C2 20.628 7.372 26 14 26C20.628 26 26 20.628 26 14C26 7.372 20.628 2 14 2ZM14 8C14.552 8 15 8.448 15 9V14.586L17.293 12.293C17.684 11.902 18.316 11.902 18.707 12.293C19.098 12.684 19.098 13.316 18.707 13.707L14.707 17.707C14.512 17.902 14.256 18 14 18C13.744 18 13.488 17.902 13.293 17.707L9.293 13.707C8.902 13.316 8.902 12.684 9.293 12.293C9.684 11.902 10.316 11.902 10.707 12.293L13 14.586V9C13 8.448 13.448 8 14 8ZM9 19C8.448 19 8 19.448 8 20C8 20.552 8.448 21 9 21H19C19.552 21 20 20.552 20 20C20 19.448 19.552 19 19 19H9Z" fill="#000000" />
                </svg>
                <p className="font-['SF_Pro',sans-serif] font-normal text-[#000000] text-[15px] md:text-[17px] tracking-[-0.43px]">
                  CV
                </p>
              </button>
            </div>
          </div>

          {/* Photo */}
          <div className="relative rounded-[28px] md:rounded-[48px] shrink-0 w-full md:w-[416px] aspect-square md:aspect-auto md:h-[416px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-white/30">
            {loading && (
              <div className="absolute inset-0 bg-[#e8e8e8] animate-pulse" />
            )}
            <img
              alt="Александр Петров"
              className={`absolute inset-0 max-w-none object-cover pointer-events-none size-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
              src={cloudinaryOptimize(profile.photoUrl, 832) || "https://drive.google.com/uc?export=view&id=13vYeZ6qlWxU25Wn-TEacoarS5E64F1VF"}
              onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
            />
          </div>
        </div>

        {/* Projects Row */}
        <div ref={casesRef} className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[32px] py-[24px] md:py-[48px] relative shrink-0 w-full z-[2]">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-[12px] md:gap-[16px] items-start w-full animate-pulse bg-white border border-[#e5e5ea]/60 rounded-[28px] p-5 overflow-hidden">
                  <div className="pb-[12px] md:pb-[16px] border-b border-black/[0.06] w-full">
                    <div className="h-[22px] md:h-[28px] bg-[#f0f0f0] rounded-[6px] w-3/4" />
                  </div>
                  <div className="flex gap-[24px] md:gap-[42px]">
                    <div className="flex flex-col gap-[6px]">
                      <div className="h-[12px] bg-[#f0f0f0] rounded-[4px] w-[48px]" />
                      <div className="h-[16px] bg-[#f0f0f0] rounded-[4px] w-[80px]" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <div className="h-[12px] bg-[#f0f0f0] rounded-[4px] w-[56px]" />
                      <div className="h-[16px] bg-[#f0f0f0] rounded-[4px] w-[64px]" />
                    </div>
                  </div>
                  <div className="aspect-video w-full rounded-[16px] bg-[#f0f0f0]" />
                </div>
              ))}
            </>
          ) : projects.length === 0 ? (
            <div className="w-full text-center py-[48px]">
              <p className="font-['SF_Pro',sans-serif] text-[#000000] text-[20px] md:text-[24px]">{tr.no_projects}</p>
            </div>
          ) : (
            projects.map((project) => {
              const CardWrapper = project.inProgress ? 'div' : Link;
              const wrapperProps = project.inProgress ? {} : { to: `/case/${project.slug}` };
              return (
                <CardWrapper
                  key={project.id}
                  {...wrapperProps as any}
                  className={`flex flex-col gap-[12px] md:gap-[16px] items-start w-full relative group rounded-[28px] p-5 transition-all duration-300 ${
                    project.inProgress
                      ? 'cursor-default border border-transparent'
                      : 'cursor-pointer bg-white border border-[#e5e5ea]/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:border-[#d1d1d6]'
                  }`}
                >
                  <div className="flex items-center pb-[12px] md:pb-[16px] relative shrink-0 w-full border-b border-black/[0.08] group-hover:border-black/20 transition-colors duration-300">
                    <p className={`flex-1 font-['SF_Pro',sans-serif] font-medium text-[20px] md:text-[28px] text-ellipsis tracking-[0.38px] whitespace-nowrap overflow-hidden ${
                      project.inProgress ? 'text-black/30' : 'text-[#000000]'
                    }`}>
                      {project.title}
                    </p>
                  </div>
                  <div className="flex gap-[24px] md:gap-[42px] items-start shrink-0 w-full">
                    <div className="flex flex-col items-start">
                      <p className={`font-['SF_Pro',sans-serif] font-normal text-[13px] md:text-[17px] tracking-[-0.43px] ${
                        project.inProgress ? 'text-black/20' : 'text-[#6e6e73]'
                      }`}>
                        {tr.label_product}
                      </p>
                      <p className={`font-['SF_Pro',sans-serif] font-normal text-[15px] md:text-[20px] tracking-[-0.45px] ${
                        project.inProgress ? 'text-black/30' : 'text-[#000000]'
                      }`}>
                        {project.product}
                      </p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className={`font-['SF_Pro',sans-serif] font-normal text-[13px] md:text-[17px] tracking-[-0.43px] ${
                        project.inProgress ? 'text-black/20' : 'text-[#6e6e73]'
                      }`}>
                        {tr.label_platform}
                      </p>
                      <p className={`font-['SF_Pro',sans-serif] font-normal text-[15px] md:text-[20px] tracking-[-0.45px] ${
                        project.inProgress ? 'text-black/30' : 'text-[#000000]'
                      }`}>
                        {project.platform}
                      </p>
                    </div>
                  </div>
                  <div className="aspect-video relative rounded-[16px] w-full overflow-hidden ring-1 ring-black/[0.04]">
                    {project.imageUrl ? (
                      <>
                        <img
                          alt={project.title}
                          className={`absolute max-w-none object-cover size-full transition-transform duration-300 ${
                            project.inProgress ? 'opacity-40' : 'group-hover:scale-[1.02]'
                          }`}
                          src={cloudinaryOptimize(project.imageUrl, 800)}
                          loading="lazy"
                        />
                        {project.inProgress ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-full px-[20px] py-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                              <p className="font-['SF_Pro',sans-serif] font-medium text-white/90 text-[14px] md:text-[16px] tracking-[-0.02em]">
                                {tr.in_progress}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                        {project.inProgress ? (
                          <div className="bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-full px-[20px] py-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                            <p className="font-['SF_Pro',sans-serif] font-medium text-white/90 text-[14px] md:text-[16px] tracking-[-0.02em]">
                              В работе
                            </p>
                          </div>
                        ) : (
                          <span className="font-['SF_Pro',sans-serif] text-[#6e6e73] text-[16px] md:text-[20px]">{project.title}</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardWrapper>
              );
            })
          )}
        </div>

        {/* About Me Section */}
        <div ref={aboutRef} className="flex flex-col font-normal gap-[24px] items-start py-[24px] md:py-[48px] relative shrink-0 text-black w-full z-[1]">
          <p className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[32px] md:text-[42px] tracking-[-0.5px] md:tracking-[-1px] leading-none">
            {tr.about_title}
          </p>
          <div className="font-['SF_Pro',sans-serif] text-[#000000] text-[16px] md:text-[24px] leading-[1.4] md:leading-[1.2] max-w-[996px]">
            {profile.about ? (
              profile.about.split('\n\n').map((para, i, arr) => (
                <p key={i} className={i < arr.length - 1 ? 'mb-[24px] md:mb-[32px]' : ''}>
                  {para}
                </p>
              ))
            ) : (
              <>
                <p className="mb-[24px] md:mb-[32px]">{tr.about_default_1}</p>
                <p className="mb-[24px] md:mb-[32px]">{tr.about_default_2}</p>
                <p>{tr.about_default_3}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
