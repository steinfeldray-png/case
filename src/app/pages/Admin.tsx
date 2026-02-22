import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, User, Briefcase } from 'lucide-react';
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

interface Profile {
  photoUrl?: string;
  name?: string;
  about?: string;
  telegramUrl?: string;
  cvUrl?: string;
}

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'profile'>('projects');

  const emptyProject: Omit<Project, 'id'> = {
    slug: '',
    title: '',
    product: '',
    platform: '',
    description: '',
    year: new Date().getFullYear().toString(),
    challenge: '',
    solution: '',
    results: [''],
    tags: ['']
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.projects);
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (project: Project | Omit<Project, 'id'>) => {
    try {
      const url = 'id' in project
        ? API_ENDPOINTS.projectById(project.id)
        : API_ENDPOINTS.projects;
      
      const method = 'id' in project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });

      const result = await response.json();
      if (result.success) {
        await fetchProjects();
        setEditingProject(null);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;

    try {
      const response = await fetch(API_ENDPOINTS.projectById(id), {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const initializeDatabase = async () => {
    if (!confirm('Это загрузит демо-проекты в базу данных. Продолжить?')) return;

    try {
      const response = await fetch(API_ENDPOINTS.init, {
        method: 'POST'
      });

      const result = await response.json();
      if (result.success) {
        await fetchProjects();
        alert('База данных инициализирована!');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  return (
    <div className="bg-[#fffbfa] min-h-screen">
      {/* Header */}
      <div className="bg-[#fffbfa] flex items-center justify-between px-[48px] py-[16px] sticky top-0 z-10 border-b border-[#ccc]">
        <div className="flex items-center gap-[24px]">
          <Link
            to="/"
            className="flex items-center gap-[8px] text-[#281d1b] hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="size-[24px]" />
            <p className="font-['SF_Pro',sans-serif] font-normal leading-[34px] text-[28px] tracking-[0.38px]">
              На главную
            </p>
          </Link>
        </div>
        <div className="flex gap-[12px]">
          <button
            onClick={initializeDatabase}
            className="bg-[#f5f0ef] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-[#281d1b] text-[17px] hover:bg-[#e5e0df] transition-colors"
          >
            Загрузить демо-данные
          </button>
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingProject({ ...emptyProject, id: 0 } as Project);
            }}
            className="bg-[#281d1b] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-white text-[17px] hover:opacity-80 transition-opacity flex items-center gap-[8px]"
          >
            <Plus className="size-[20px]" />
            Новый проект
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-[48px] py-[32px]">
        {/* Tabs */}
        {!editingProject && (
          <div className="inline-flex bg-[#f5f0ef] p-[4px] rounded-[12px] mb-[32px]">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-[24px] py-[8px] rounded-[8px] font-['SF_Pro',sans-serif] text-[15px] transition-all flex items-center gap-[6px] ${
                activeTab === 'projects'
                  ? 'bg-white text-[#281d1b] shadow-sm'
                  : 'text-[#281d1b] hover:opacity-60'
              }`}
            >
              <Briefcase className="size-[16px]" />
              Проекты
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-[24px] py-[8px] rounded-[8px] font-['SF_Pro',sans-serif] text-[15px] transition-all flex items-center gap-[6px] ${
                activeTab === 'profile'
                  ? 'bg-white text-[#281d1b] shadow-sm'
                  : 'text-[#281d1b] hover:opacity-60'
              }`}
            >
              <User className="size-[16px]" />
              Настройки профиля
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[24px]">
            Загрузка...
          </p>
        ) : activeTab === 'profile' ? (
          <ProfileSettings />
        ) : editingProject ? (
          <ProjectForm
            project={editingProject}
            isCreating={isCreating}
            onSave={handleSave}
            onCancel={() => {
              setEditingProject(null);
              setIsCreating(false);
            }}
            onChange={setEditingProject}
          />
        ) : (
          <div className="grid grid-cols-3 gap-[24px]">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-[#ccc] rounded-[24px] p-[24px] flex flex-col relative"
              >
                {/* Action Buttons */}
                <div className="absolute top-[16px] right-[16px] flex gap-[6px] z-10">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-[8px] rounded-[8px] bg-white/90 hover:bg-[#f5f0ef] transition-colors shadow-sm"
                  >
                    <Edit className="size-[16px] text-[#281d1b]" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-[8px] rounded-[8px] bg-white/90 hover:bg-[#fee] transition-colors shadow-sm"
                  >
                    <Trash2 className="size-[16px] text-red-500" />
                  </button>
                </div>

                {/* Image */}
                {project.imageUrl && (
                  <div className="w-full h-[200px] rounded-[12px] overflow-hidden mb-[16px]">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Нет+изображения';
                      }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1">
                  <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[22px] mb-[8px]">
                    {project.title}
                  </h2>
                  <p className="font-['SF_Pro',sans-serif] text-[#9d9ea2] text-[15px] mb-[12px]">
                    {project.product} • {project.platform} • {project.year}
                  </p>
                  <p className="font-['Roboto',sans-serif] text-[#281d1b] text-[15px] line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectFormProps {
  project: Project;
  isCreating: boolean;
  onSave: (project: Project | Omit<Project, 'id'>) => void;
  onCancel: () => void;
  onChange: (project: Project) => void;
}

function ProjectForm({ project, isCreating, onSave, onCancel, onChange }: ProjectFormProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingCaseImage, setUploadingCaseImage] = useState(false);
  const [caseImageError, setCaseImageError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Файл выбран:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Неверный формат файла. Разрешены только изображения.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Размер файла превышает 5 МБ.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Отправка запроса на сервер...');

      const response = await fetch(
        API_ENDPOINTS.upload,
        {
          method: 'POST',
          body: formData
        }
      );

      console.log('Ответ сервера статус:', response.status);

      const result = await response.json();
      console.log('Ответ сервера:', result);
      
      if (result.success && result.data?.url) {
        console.log('Успешная загрузка! URL:', result.data.url);
        updateField('imageUrl', result.data.url);
      } else {
        console.error('Ошибка в ответе сервера:', result);
        setUploadError(result.error || 'Ошибка загрузки изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
    }
  };

  const handleCaseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Файл выбран:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setCaseImageError('Неверный формат файла. Разрешены только изображения.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setCaseImageError('Размер файла превышает 5 МБ.');
      return;
    }

    setUploadingCaseImage(true);
    setCaseImageError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Отправка запроса на сервер...');

      const response = await fetch(
        API_ENDPOINTS.upload,
        {
          method: 'POST',
          body: formData
        }
      );

      console.log('Ответ сервера статус:', response.status);

      const result = await response.json();
      console.log('Ответ сервера:', result);
      
      if (result.success && result.data?.url) {
        console.log('Успешная загрузка! URL:', result.data.url);
        updateField('caseImages', [...(project.caseImages || []), result.data.url]);
      } else {
        console.error('Ошибка в ответе сервера:', result);
        setCaseImageError(result.error || 'Ошибка загрузки изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setCaseImageError('Ошибка при загрузке файла');
    } finally {
      setUploadingCaseImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty results and tags
    const cleanProject = {
      ...project,
      results: project.results.filter(r => r.trim() !== ''),
      tags: project.tags.filter(t => t.trim() !== '')
    };

    if (isCreating) {
      const { id, ...projectWithoutId } = cleanProject;
      onSave(projectWithoutId);
    } else {
      onSave(cleanProject);
    }
  };

  const updateField = (field: keyof Project, value: any) => {
    onChange({ ...project, [field]: value });
  };

  const addArrayItem = (field: 'results' | 'tags') => {
    updateField(field, [...project[field], '']);
  };

  const updateArrayItem = (field: 'results' | 'tags', index: number, value: string) => {
    const newArray = [...project[field]];
    newArray[index] = value;
    updateField(field, newArray);
  };

  const removeArrayItem = (field: 'results' | 'tags', index: number) => {
    const newArray = project[field].filter((_, i) => i !== index);
    updateField(field, newArray);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#ccc] rounded-[24px] p-[48px] max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-[32px]">
        <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[34px]">
          {isCreating ? 'Новый проект' : 'Редактирование проекта'}
        </h2>
        <div className="flex gap-[12px]">
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#f5f0ef] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-[#281d1b] text-[17px] hover:bg-[#e5e0df] transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="bg-[#281d1b] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-white text-[17px] hover:opacity-80 transition-opacity"
          >
            Сохранить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[24px] mb-[24px]">
        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
            Название проекта *
          </label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
            Slug (URL) *
          </label>
          <input
            type="text"
            value={project.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            required
            placeholder="например: komus"
            className="w-full px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
            Продукт *
          </label>
          <input
            type="text"
            value={project.product}
            onChange={(e) => updateField('product', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
            Платформа *
          </label>
          <input
            type="text"
            value={project.platform}
            onChange={(e) => updateField('platform', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
            Изображение проекта
          </label>
          
          {project.imageUrl ? (
            <div className="relative rounded-[12px] overflow-hidden border border-[#ccc] w-[280px] h-[280px]">
              <img
                src={project.imageUrl}
                alt="Превью"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/280x280?text=Ошибка+загрузки';
                }}
              />
              <button
                type="button"
                onClick={() => updateField('imageUrl', '')}
                className="absolute top-[8px] right-[8px] p-[8px] bg-white rounded-[8px] hover:bg-red-50 transition-colors"
              >
                <X className="size-[16px] text-red-500" />
              </button>
            </div>
          ) : (
            <label className="w-full h-[280px] border-2 border-dashed border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] hover:border-[#007AFF] transition-colors cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[#f5f0ef] hover:bg-[#e5e0df]">
              <Upload className="size-[32px] text-[#281d1b]" />
              <span className="text-[#281d1b] text-center px-[16px]">
                {uploading ? 'Загрузка...' : 'Выбрать файл для загрузки'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
          
          <p className="mt-[8px] text-[#9d9ea2] text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
            Максимальный размер: 5 МБ<br />
            Форматы: JPG, PNG, WEBP, GIF
          </p>
          {uploadError && (
            <p className="mt-[4px] text-red-500 text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
              {uploadError}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
            Краткое описание *
          </label>
          <input
            type="text"
            value={project.description}
            onChange={(e) => updateField('description', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
            Год *
          </label>
          <input
            type="text"
            value={project.year}
            onChange={(e) => updateField('year', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
          />
        </div>
      </div>

      <div className="mb-[24px]">
        <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
          Задача *
        </label>
        <textarea
          value={project.challenge}
          onChange={(e) => updateField('challenge', e.target.value)}
          required
          rows={4}
          className="w-full px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['Roboto',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
        />
      </div>

      <div className="mb-[24px]">
        <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[8px]">
          Решение *
        </label>
        <textarea
          value={project.solution}
          onChange={(e) => updateField('solution', e.target.value)}
          required
          rows={4}
          className="w-full px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['Roboto',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
        />
      </div>

      <div className="mb-[24px]">
        <div className="flex items-center justify-between mb-[8px]">
          <label className="font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px]">
            Результаты
          </label>
          <button
            type="button"
            onClick={() => addArrayItem('results')}
            className="text-[#007AFF] font-['SF_Pro',sans-serif] text-[15px] hover:opacity-60"
          >
            + Добавить результат
          </button>
        </div>
        {project.results.map((result, index) => (
          <div key={index} className="flex gap-[8px] mb-[8px]">
            <input
              type="text"
              value={result}
              onChange={(e) => updateArrayItem('results', index, e.target.value)}
              className="flex-1 px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['Roboto',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('results', index)}
              className="p-[12px] rounded-[12px] hover:bg-[#fee] transition-colors"
            >
              <X className="size-[20px] text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-[24px]">
        <div className="flex items-center justify-between mb-[8px]">
          <label className="font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px]">
            Теги
          </label>
          <button
            type="button"
            onClick={() => addArrayItem('tags')}
            className="text-[#007AFF] font-['SF_Pro',sans-serif] text-[15px] hover:opacity-60"
          >
            + Добавить тег
          </button>
        </div>
        {project.tags.map((tag, index) => (
          <div key={index} className="flex gap-[8px] mb-[8px]">
            <input
              type="text"
              value={tag}
              onChange={(e) => updateArrayItem('tags', index, e.target.value)}
              className="flex-1 px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('tags', index)}
              className="p-[12px] rounded-[12px] hover:bg-[#fee] transition-colors"
            >
              <X className="size-[20px] text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Case Images Section */}
      <div className="mb-[24px] border-t border-[#ccc] pt-[24px]">
        <div className="flex items-center justify-between mb-[12px]">
          <div>
            <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[4px]">
              Фотографии кейса
            </label>
            <p className="text-[#9d9ea2] text-[14px] font-['SF_Pro',sans-serif]">
              Загрузите изображения для детального просмотра проекта
            </p>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-[12px]">
          <label className="w-[280px] h-[280px] border-2 border-dashed border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] hover:border-[#007AFF] transition-colors cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[#f5f0ef] hover:bg-[#e5e0df]">
            <ImageIcon className="size-[32px] text-[#281d1b]" />
            <span className="text-[#281d1b] text-center px-[16px]">
              {uploadingCaseImage ? 'Загрузка...' : 'Добавить фото кейса'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCaseImageUpload}
              disabled={uploadingCaseImage}
              className="hidden"
            />
          </label>
          <p className="mt-[8px] text-[#9d9ea2] text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
            Максимальный размер: 5 МБ<br />
            Форматы: JPG, PNG, WEBP, GIF
          </p>
          {caseImageError && (
            <p className="mt-[4px] text-red-500 text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
              {caseImageError}
            </p>
          )}
        </div>

        {/* Case Images Grid */}
        {project.caseImages && project.caseImages.length > 0 && (
          <div className="flex flex-wrap gap-[12px] mt-[16px]">
            {project.caseImages.map((imageUrl, index) => (
              <div key={index} className="relative rounded-[12px] overflow-hidden border border-[#ccc] group w-[280px] h-[280px]">
                <img
                  src={imageUrl}
                  alt={`Кейс фото ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/280x280?text=Ошибка+загрузки';
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = project.caseImages?.filter((_, i) => i !== index) || [];
                    updateField('caseImages', newImages);
                  }}
                  className="absolute top-[8px] right-[8px] p-[8px] bg-white rounded-[8px] hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="size-[16px] text-red-500" />
                </button>
                <div className="absolute bottom-[8px] left-[8px] px-[8px] py-[4px] bg-black/60 text-white text-[12px] rounded-[6px] font-['SF_Pro',sans-serif]">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}

function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvUploadError, setCvUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.profile);
      const result = await response.json();
      if (result.success && result.data) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Файл выбран:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Неверный формат файла. Разрешены только изображения.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Размер файла превышает 5 МБ.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Отправка запроса на сервер...');

      const response = await fetch(
        API_ENDPOINTS.upload,
        {
          method: 'POST',
          body: formData
        }
      );

      console.log('Ответ сервера статус:', response.status);

      const result = await response.json();
      console.log('Ответ сервера:', result);
      
      if (result.success && result.data?.url) {
        console.log('Успешная загрузка! URL:', result.data.url);
        setProfile({ ...profile, photoUrl: result.data.url });
      } else {
        console.error('Ошибка в ответе сервера:', result);
        setUploadError(result.error || 'Ошибка загрузки изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Файл выбран:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setCvUploadError('Неверный формат файла. Разрешены только PDF.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setCvUploadError('Размер файла превышает 5 МБ.');
      return;
    }

    setUploadingCV(true);
    setCvUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Отправка запроса на сервер...');

      const response = await fetch(
        API_ENDPOINTS.upload,
        {
          method: 'POST',
          body: formData
        }
      );

      console.log('Ответ сервера статус:', response.status);

      const result = await response.json();
      console.log('Ответ сервера:', result);
      
      if (result.success && result.data?.url) {
        console.log('Успешная загрузка! URL:', result.data.url);
        setProfile({ ...profile, cvUrl: result.data.url });
      } else {
        console.error('Ошибка в ответе сервера:', result);
        setCvUploadError(result.error || 'Ошибка загрузки файла');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      setCvUploadError('Ошибка при загрузке файла');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(
        API_ENDPOINTS.profile,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profile)
        }
      );

      const result = await response.json();
      if (result.success) {
        alert('Профиль успешно сохранён!');
      } else {
        alert('Ошибка при сохранении профиля');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Ошибка при сохранении профиля');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Profile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#ccc] rounded-[24px] p-[48px] max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-[32px]">
        <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#281d1b] text-[34px]">
          Настройки профиля
        </h2>
        <div className="flex gap-[12px]">
          <button
            type="submit"
            className="bg-[#281d1b] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-white text-[17px] hover:opacity-80 transition-opacity"
          >
            Сохранить
          </button>
        </div>
      </div>

      <div>
        {/* Form Fields Section */}
        
        {/* Photo Section */}
        <div className="mb-[24px]">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[12px]">
            Фото профиля
          </label>
          
          {profile.photoUrl ? (
            <div className="relative rounded-[12px] overflow-hidden border border-[#ccc] w-[280px] h-[280px]">
              <img
                src={profile.photoUrl}
                alt="Превью"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/280x280?text=Ошибка+загрузки';
                }}
              />
              <button
                type="button"
                onClick={() => updateField('photoUrl', '')}
                className="absolute top-[8px] right-[8px] p-[8px] bg-white rounded-[8px] hover:bg-red-50 transition-colors"
              >
                <X className="size-[16px] text-red-500" />
              </button>
            </div>
          ) : (
            <label className="w-[280px] h-[280px] border-2 border-dashed border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] hover:border-[#007AFF] transition-colors cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[#f5f0ef] hover:bg-[#e5e0df]">
              <Upload className="size-[32px] text-[#281d1b]" />
              <span className="text-[#281d1b] text-center px-[16px]">
                {uploading ? 'Загрузка...' : 'Выбрать фото'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
          
          <p className="mt-[8px] text-[#9d9ea2] text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
            Максимальный размер: 5 МБ<br />
            Форматы: JPG, PNG, WEBP, GIF
          </p>
          {uploadError && (
            <p className="mt-[4px] text-red-500 text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
              {uploadError}
            </p>
          )}
        </div>

        <div className="mb-[24px]">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[12px]">
            О себе
          </label>
          <textarea
            value={profile.about || ''}
            onChange={(e) => updateField('about', e.target.value)}
            placeholder="Введите информацию о себе"
            rows={4}
            className="w-[280px] px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        {/* Telegram URL */}
        <div className="mb-[24px]">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[12px]">
            Ссылка на Telegram
          </label>
          <input
            type="url"
            value={profile.telegramUrl || ''}
            onChange={(e) => updateField('telegramUrl', e.target.value)}
            placeholder="https://t.me/username"
            className="w-[280px] px-[16px] py-[12px] border border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        {/* CV Section */}
        <div className="mb-[24px]">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#281d1b] text-[17px] mb-[12px]">
            Резюме
          </label>
          
          {profile.cvUrl ? (
            <div className="relative rounded-[12px] overflow-hidden border border-[#ccc] w-[280px] h-[280px]">
              <img
                src={profile.cvUrl}
                alt="Превью"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/280x280?text=Ошибка+загрузки';
                }}
              />
              <button
                type="button"
                onClick={() => updateField('cvUrl', '')}
                className="absolute top-[8px] right-[8px] p-[8px] bg-white rounded-[8px] hover:bg-red-50 transition-colors"
              >
                <X className="size-[16px] text-red-500" />
              </button>
            </div>
          ) : (
            <label className="w-[280px] h-[280px] border-2 border-dashed border-[#ccc] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] hover:border-[#007AFF] transition-colors cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[#f5f0ef] hover:bg-[#e5e0df]">
              <Upload className="size-[32px] text-[#281d1b]" />
              <span className="text-[#281d1b] text-center px-[16px]">
                {uploadingCV ? 'Загрузка...' : 'Выбрать резюме'}
              </span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleCVUpload}
                disabled={uploadingCV}
                className="hidden"
              />
            </label>
          )}
          
          <p className="mt-[8px] text-[#9d9ea2] text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
            Максимальный размер: 5 МБ<br />
            Формат: PDF
          </p>
          {cvUploadError && (
            <p className="mt-[4px] text-red-500 text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
              {cvUploadError}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}