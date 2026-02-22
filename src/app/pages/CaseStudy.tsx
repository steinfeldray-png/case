import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
      <div className="bg-[#fffbfa] size-full flex items-center justify-center">
        <p className="font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[24px]">Загрузка...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-[#fffbfa] size-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['SF_Pro',sans-serif] text-[48px] font-bold text-[#281d1b] mb-4">
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
    <div className="bg-[#fffbfa] min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-[#fffbfa] content-stretch flex items-center justify-between px-[48px] py-[16px] sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-[8px] text-[#281d1b] hover:opacity-60 transition-opacity"
        >
          <ArrowLeft className="size-[24px]" />
          <p className="font-['SF_Pro',sans-serif] font-normal leading-[34px] text-[28px] tracking-[0.38px]">
            Назад
          </p>
        </button>
        <Link 
          to="/"
          className="font-['SF_Pro',sans-serif] font-normal leading-[34px] text-[#281d1b] text-[28px] tracking-[0.38px]"
        >
          Alexander Petrov
        </Link>
      </div>

      {/* Hero Section */}
      <div className="px-[48px] py-[64px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-[24px] items-center mb-[24px]">
            <h1 className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[72px] leading-[1.1]">
              {project.title}
            </h1>
            <span className="font-['SF_Pro',sans-serif] font-normal text-[#9d9ea2] text-[28px]">
              {project.year}
            </span>
          </div>
          
          <div className="flex gap-[48px] mb-[48px]">
            <div>
              <p className="font-['SF_Pro',sans-serif] font-[590] leading-[22px] text-[#9d9ea2] text-[17px] tracking-[-0.43px] mb-[8px]">
                Продукт
              </p>
              <p className="font-['SF_Pro',sans-serif] font-normal leading-[28px] text-[#281d1b] text-[22px]">
                {project.product}
              </p>
            </div>
            <div>
              <p className="font-['SF_Pro',sans-serif] font-[590] leading-[22px] text-[#9d9ea2] text-[17px] tracking-[-0.43px] mb-[8px]">
                Платформа
              </p>
              <p className="font-['SF_Pro',sans-serif] font-normal leading-[28px] text-[#281d1b] text-[22px]">
                {project.platform}
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-[24px] overflow-hidden h-[600px] mb-[64px]">
            <img 
              alt={project.title}
              className="absolute max-w-none object-cover size-full" 
              src={project.imageUrl || `https://images.unsplash.com/photo-${1460925895917 + index * 1000}-${index === 0 ? '15a4b203' : index === 1 ? '2a7b7b2c' : index === 2 ? '3c8d8d3d' : '4e9e9e4e'}-${(index + 1) * 12345}a?w=1600&h=900&fit=crop`}
            />
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-12 gap-[48px]">
            <div className="col-span-8">
              {/* Challenge */}
              <section className="mb-[64px]">
                <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[42px] mb-[24px]">
                  Задача
                </h2>
                <p className="font-['Roboto',sans-serif] text-[#281d1b] text-[24px] leading-[1.6]">
                  {project.challenge}
                </p>
              </section>

              {/* Solution */}
              <section className="mb-[64px]">
                <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[42px] mb-[24px]">
                  Решение
                </h2>
                <p className="font-['Roboto',sans-serif] text-[#281d1b] text-[24px] leading-[1.6]">
                  {project.solution}
                </p>
              </section>

              {/* Images */}
              {project.caseImages && project.caseImages.length > 0 && (
                <section className="mb-[64px]">
                  <div className="flex flex-col gap-[24px]">
                    {project.caseImages.map((imageUrl, imgIndex) => (
                      <div key={imgIndex} className="rounded-[24px] overflow-hidden w-full">
                        <img 
                          alt={`${project.title} - скриншот ${imgIndex + 1}`}
                          className="w-full h-auto object-contain" 
                          src={imageUrl}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Изображение+не+найдено';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-span-4">
              {/* Results */}
              <div className="bg-[#f5f0ef] rounded-[24px] p-[32px] mb-[32px]">
                <h3 className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[28px] mb-[24px]">
                  Результаты
                </h3>
                <ul className="space-y-[16px]">
                  {project.results.map((result, idx) => (
                    <li key={idx} className="flex items-start gap-[12px]">
                      <span className="text-[#007AFF] text-[24px] mt-[-4px]">✓</span>
                      <span className="font-['Roboto',sans-serif] text-[#281d1b] text-[20px] leading-[1.4]">
                        {result}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-['SF_Pro',sans-serif] font-[590] text-[#9d9ea2] text-[17px] mb-[12px]">
                  Технологии и методы
                </h3>
                <div className="flex flex-wrap gap-[8px]">
                  {project.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-[#f5f0ef] px-[16px] py-[8px] rounded-[100px] font-['SF_Pro',sans-serif] text-[#281d1b] text-[17px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next/Previous Projects */}
          <div className="border-t border-[#ccc] pt-[48px] mt-[64px]">
            <div className="flex justify-between items-center">
              <div>
                {index > 0 && (
                  <Link 
                    to={`/case/${allProjects[index - 1].slug}`}
                    className="group flex items-center gap-[12px] hover:opacity-60 transition-opacity"
                  >
                    <ArrowLeft className="size-[24px] text-[#281d1b]" />
                    <div>
                      <p className="font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[17px] mb-[4px]">
                        Предыдущий проект
                      </p>
                      <p className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[28px]">
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
                      <p className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[28px]">
                        {allProjects[index + 1].title}
                      </p>
                    </div>
                    <ArrowLeft className="size-[24px] text-[#281d1b] rotate-180" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}