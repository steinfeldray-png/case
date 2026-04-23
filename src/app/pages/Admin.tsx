import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';

// WYSIWYG Rich Text Editor — форматирование без кода
function RichTextEditor({ value, onChange, label }: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Инициализация контента только один раз при монтировании
  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = value || '';
      initialized.current = true;
    }
  }, []);

  const sync = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange(html === '<br>' ? '' : html);
  };

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    sync();
  };

  const toolbar = [
    { label: 'Ж', title: 'Жирный (Ctrl+B)', command: 'bold', style: 'font-bold' },
    { label: 'К', title: 'Курсив (Ctrl+I)', command: 'italic', style: 'italic' },
    { label: '• Список', title: 'Маркированный список', command: 'insertUnorderedList', style: '' },
  ];

  return (
    <div className="mb-[24px]">
      <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[8px]">
        {label}
      </label>
      <div className="border border-[#e5e5ea] rounded-[12px] overflow-hidden bg-[#f5f5f7] focus-within:border-[#007AFF] focus-within:ring-1 focus-within:ring-[#007AFF]/30 transition-all">
        {/* Toolbar */}
        <div className="flex gap-[2px] px-[10px] py-[6px] border-b border-[#e5e5ea] bg-white">
          {toolbar.map(({ label: l, title, command, style }) => (
            <button
              key={command}
              type="button"
              title={title}
              onMouseDown={(e) => {
                e.preventDefault(); // сохраняем фокус в редакторе
                exec(command);
              }}
              className={`px-[10px] py-[4px] rounded-[6px] text-[14px] font-['SF_Pro',sans-serif] hover:bg-[#f5f5f7] transition-colors text-[#000000] ${style}`}
            >
              {l}
            </button>
          ))}
        </div>
        {/* Редактируемая область */}
        <div
          ref={editorRef}
          contentEditable
          onInput={sync}
          onPaste={(e) => {
            e.preventDefault();
            // Вставляем только чистый текст, без стилей из буфера
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
          }}
          suppressContentEditableWarning
          data-placeholder="Введите текст..."
          className="w-full min-h-[140px] px-[16px] py-[12px] text-[17px] leading-[1.7] focus:outline-none font-['SF_Pro',sans-serif] text-[#000000] [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_ul]:list-disc [&_ul]:pl-[20px] [&_li]:my-[2px] empty:before:content-[attr(data-placeholder)] empty:before:text-[#6e6e73]"
        />
      </div>
    </div>
  );
}

import { API_ENDPOINTS } from '/src/config/api';

const getAdminKey = () => sessionStorage.getItem('adminKey') || '';

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Admin-Key': getAdminKey(),
});

const adminFetchHeaders = () => ({
  'X-Admin-Key': getAdminKey(),
});

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
  inProgress?: boolean;
}

interface Profile {
  photoUrl?: string;
  name?: string;
  about?: string;
  telegramUrl?: string;
  cvUrl?: string;
}

export default function Admin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'profile'>('projects');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const urlKey = searchParams.get('key');
    const storedKey = sessionStorage.getItem('adminKey');
    const validKey = import.meta.env.VITE_ADMIN_KEY;

    if (!validKey) {
      setAuthorized(true);
    } else if (urlKey === validKey) {
      sessionStorage.setItem('adminKey', urlKey);
      navigate('/admin', { replace: true });
      setAuthorized(true);
    } else if (storedKey === validKey) {
      setAuthorized(true);
    } else {
      navigate('/', { replace: true });
    }
  }, []);

  useEffect(() => {
    if (authorized) fetchProjects();
  }, [authorized]);

  if (!authorized) return null;

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
    tags: [''],
    inProgress: false
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.projects, { cache: 'no-store' });
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
    setSaveError(null);
    setSaving(true);
    try {
      const url = 'id' in project
        ? API_ENDPOINTS.projectById(project.id)
        : API_ENDPOINTS.projects;

      const method = 'id' in project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: adminHeaders(),
        body: JSON.stringify(project)
      });

      const result = await response.json();
      if (result.success) {
        await fetchProjects();
        setEditingProject(null);
        setIsCreating(false);
        setSaveError(null);
      } else {
        setSaveError(result.error || 'Ошибка при сохранении');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setSaveError('Ошибка соединения с сервером');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;

    try {
      const response = await fetch(API_ENDPOINTS.projectById(id), {
        method: 'DELETE',
        headers: adminFetchHeaders(),
      });

      const result = await response.json();
      if (result.success) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };


  return (
    <div className="bg-white min-h-screen">
      {/* Header — glass */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-black/[0.08] sticky top-0 z-[10] w-full">
        <div className="flex items-center justify-between py-[16px] px-5 md:px-[120px] max-w-[1440px] mx-auto">
          <Link
            to="/"
            className="flex items-center gap-[8px] text-[#000000] hover:opacity-60 transition-opacity"
          >
            <ChevronLeft className="size-[20px] md:size-[24px]" />
            <p className="font-['SF_Pro',sans-serif] font-normal text-[18px] md:text-[28px] tracking-[0.38px]">
              На главную
            </p>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 md:px-[120px] py-[32px] max-w-[1440px] mx-auto">
        {/* Tabs + New Project button */}
        {!editingProject && (
          <div className="flex items-center justify-between mb-[32px]">
            <div className="inline-flex bg-[#f5f5f7] p-[4px] rounded-[12px]">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-[24px] py-[8px] rounded-[8px] font-['SF_Pro',sans-serif] text-[15px] transition-all ${
                activeTab === 'projects'
                  ? 'bg-white text-[#000000] shadow-sm'
                  : 'text-[#000000] hover:opacity-60'
              }`}
            >
              Проекты
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-[24px] py-[8px] rounded-[8px] font-['SF_Pro',sans-serif] text-[15px] transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-[#000000] shadow-sm'
                  : 'text-[#000000] hover:opacity-60'
              }`}
            >
              Настройки профиля
            </button>
            </div>
            {activeTab === 'projects' && !isCreating && (
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingProject({ ...emptyProject, id: 0 } as Project);
                }}
                className="bg-[#007AFF] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-white text-[17px] hover:bg-[#0066DD] transition-colors shadow-[0_2px_12px_rgba(0,122,255,0.3)] flex items-center gap-[8px]"
              >
                <Plus className="size-[20px]" />
                Новый проект
              </button>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-center font-['SF_Pro',sans-serif] text-[#6e6e73] text-[24px]">
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
              setSaveError(null);
            }}
            onChange={setEditingProject}
            saving={saving}
            saveError={saveError}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] md:gap-[32px]">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col gap-[12px] md:gap-[16px] items-start w-full bg-white border border-[#e5e5ea]/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-[28px] p-5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:border-[#e5e5ea] transition-all duration-300"
              >
                {/* Title + Badge */}
                <div className="flex items-start pb-[12px] md:pb-[16px] relative shrink-0 w-full border-b border-black/[0.08] group-hover:border-black/20 transition-colors duration-300">
                  <p className="flex-1 font-['SF_Pro',sans-serif] text-[#000000] text-[20px] md:text-[22px] font-medium tracking-[-0.01em] leading-[1.2]">
                    {project.title}
                  </p>
                  {project.inProgress && (
                    <span className="ml-[8px] mt-[2px] px-[10px] py-[3px] bg-[#FF9500]/15 text-[#FF9500] text-[12px] font-['SF_Pro',sans-serif] font-medium rounded-full whitespace-nowrap shrink-0">
                      В работе
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="flex gap-[24px] md:gap-[42px]">
                  <div>
                    <p className="font-['SF_Pro',sans-serif] font-normal text-[#6e6e73] text-[13px]">Продукт</p>
                    <p className="font-['SF_Pro',sans-serif] text-[#000000] text-[15px]">{project.product}</p>
                  </div>
                  <div>
                    <p className="font-['SF_Pro',sans-serif] font-normal text-[#6e6e73] text-[13px]">Платформа</p>
                    <p className="font-['SF_Pro',sans-serif] text-[#000000] text-[15px]">{project.platform}</p>
                  </div>
                </div>

                {/* Image — always show */}
                <div className="aspect-video relative rounded-[16px] w-full overflow-hidden ring-1 ring-black/[0.04]">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black/[0.03] flex items-center justify-center">
                      <span className="font-['SF_Pro',sans-serif] text-black/20 text-[14px]">Нет превью</span>
                    </div>
                  )}
                </div>

                {/* Spacer to push buttons down */}
                <div className="flex-1" />

                {/* Action Buttons */}
                <div className="flex gap-[8px] w-full pt-[4px] mt-auto">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="flex-1 flex items-center justify-center gap-[6px] py-[8px] rounded-[12px] bg-[#f5f5f7] hover:bg-[#ebebed] transition-colors font-['SF_Pro',sans-serif] text-[14px] text-[#000000]"
                  >
                    <Edit className="size-[14px]" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="py-[8px] px-[12px] rounded-[12px] bg-[#f5f5f7] hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="size-[14px] text-red-500" />
                  </button>
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
  saving?: boolean;
  saveError?: string | null;
}

function ProjectForm({ project, isCreating, onSave, onCancel, onChange, saving, saveError }: ProjectFormProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingCaseImage, setUploadingCaseImage] = useState(false);
  const [caseImageError, setCaseImageError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Неверный формат файла. Разрешены только изображения.');
      return;
    }

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

      const response = await fetch(
        API_ENDPOINTS.upload,
        {
          method: 'POST',
          headers: adminFetchHeaders(),
          body: formData
        }
      );

      const result = await response.json();

      if (result.success && result.data?.url) {
        updateField('imageUrl', result.data.url);
      } else {
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

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setCaseImageError('Неверный формат файла. Разрешены только изображения.');
      return;
    }

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

      const response = await fetch(
        API_ENDPOINTS.upload,
        {
          method: 'POST',
          headers: adminFetchHeaders(),
          body: formData
        }
      );

      const result = await response.json();

      if (result.success && result.data?.url) {
        updateField('caseImages', [...(project.caseImages || []), result.data.url]);
      } else {
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
    <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5ea]/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-[28px] p-[48px] max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[34px]">
            {isCreating ? 'Новый проект' : 'Редактирование проекта'}
          </h2>
          {saveError && (
            <p className="mt-[6px] text-red-500 text-[14px] font-['SF_Pro',sans-serif]">
              ⚠ {saveError}
            </p>
          )}
        </div>
        <div className="flex gap-[12px]">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="bg-[#f5f5f7] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-[#000000] text-[17px] hover:bg-[#e5e5ea] transition-all disabled:opacity-40"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#007AFF] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-white text-[17px] hover:bg-[#0066DD] transition-colors shadow-[0_2px_12px_rgba(0,122,255,0.3)] disabled:opacity-60"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* In Progress Toggle */}
      <div className="flex items-center gap-[12px] mb-[24px]">
        <button
          type="button"
          onClick={() => updateField('inProgress', !project.inProgress)}
          className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 shrink-0 ${
            project.inProgress ? 'bg-[#007AFF]' : 'bg-black/10'
          }`}
        >
          <span className={`absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-200 ${
            project.inProgress ? 'left-[22px]' : 'left-[2px]'
          }`} />
        </button>
        <p className="font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px]">В работе</p>
      </div>

      <div className="grid grid-cols-2 gap-[24px] mb-[24px]">
        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[8px]">
            Название проекта *
          </label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all"
          />
        </div>

        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[8px]">
            Slug (URL) *
          </label>
          <input
            type="text"
            value={project.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            required
            placeholder="например: komus"
            className="w-full px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all placeholder:text-[#6e6e73]/60"
          />
        </div>

        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[8px]">
            Продукт *
          </label>
          <input
            type="text"
            value={project.product}
            onChange={(e) => updateField('product', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all"
          />
        </div>

        <div>
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[8px]">
            Платформа *
          </label>
          <input
            type="text"
            value={project.platform}
            onChange={(e) => updateField('platform', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[8px]">
            Изображение проекта
          </label>

          {project.imageUrl ? (
            <div className="relative rounded-[12px] overflow-hidden border border-[#e5e5ea] w-[280px] h-[280px]">
              <img
                src={project.imageUrl}
                alt="Превью"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={() => updateField('imageUrl', '')}
                className="absolute top-[8px] right-[8px] p-[8px] bg-white/50 backdrop-blur-xl rounded-[8px] hover:bg-red-100/50 transition-colors"
              >
                <X className="size-[16px] text-red-500" />
              </button>
            </div>
          ) : (
            <label className="w-full h-[280px] border-2 border-dashed border-[#d1d1d6] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] hover:border-[#007AFF]/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[#fafafa] hover:bg-[#f0f0f2]">
              <Upload className="size-[32px] text-[#6e6e73]" />
              <span className="text-[#000000] text-center px-[16px]">
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

          <p className="mt-[8px] text-[#6e6e73] text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
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
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[8px]">
            Краткое описание *
          </label>
          <input
            type="text"
            value={project.description}
            onChange={(e) => updateField('description', e.target.value)}
            required
            className="w-full px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all"
          />
        </div>

      </div>

      <RichTextEditor
        label="Задача"
        value={project.challenge}
        onChange={(v) => updateField('challenge', v)}
      />

      <RichTextEditor
        label="Решение"
        value={project.solution}
        onChange={(v) => updateField('solution', v)}
      />

      <div className="mb-[24px]">
        <div className="flex items-center justify-between mb-[8px]">
          <label className="font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px]">
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
              className="flex-1 px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('results', index)}
              className="p-[12px] rounded-[12px] hover:bg-red-100/30 transition-colors"
            >
              <X className="size-[20px] text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-[24px]">
        <div className="flex items-center justify-between mb-[8px]">
          <label className="font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px]">
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
              className="flex-1 px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('tags', index)}
              className="p-[12px] rounded-[12px] hover:bg-red-100/30 transition-colors"
            >
              <X className="size-[20px] text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Case Images Section */}
      <div className="mb-[24px] border-t border-black/[0.08] pt-[24px]">
        <div className="flex items-center justify-between mb-[12px]">
          <div>
            <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[4px]">
              Фотографии кейса
            </label>
            <p className="text-[#6e6e73] text-[14px] font-['SF_Pro',sans-serif]">
              Загрузите изображения для детального просмотра проекта
            </p>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-[12px]">
          <label className="w-[280px] h-[280px] border-2 border-dashed border-[#d1d1d6] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] hover:border-[#007AFF]/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[#fafafa] hover:bg-[#f0f0f2]">
            <ImageIcon className="size-[32px] text-[#6e6e73]" />
            <span className="text-[#000000] text-center px-[16px]">
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
          <p className="mt-[8px] text-[#6e6e73] text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
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
              <div key={index} className="relative rounded-[12px] overflow-hidden border border-white/30 group w-[280px] h-[280px] ring-1 ring-white/20">
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
                  className="absolute top-[8px] right-[8px] p-[8px] bg-white/50 backdrop-blur-xl rounded-[8px] hover:bg-red-100/50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="size-[16px] text-red-500" />
                </button>
                <div className="absolute bottom-[8px] left-[8px] px-[8px] py-[4px] bg-black/40 backdrop-blur-xl text-white text-[12px] rounded-[6px] font-['SF_Pro',sans-serif]">
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
      const response = await fetch(API_ENDPOINTS.profile, { cache: 'no-store' });
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

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Неверный формат файла. Разрешены только изображения.');
      return;
    }

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

      const response = await fetch(
        API_ENDPOINTS.upload,
        {
          method: 'POST',
          headers: adminFetchHeaders(),
          body: formData
        }
      );

      const result = await response.json();

      if (result.success && result.data?.url) {
        setProfile({ ...profile, photoUrl: result.data.url });
      } else {
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

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setCvUploadError('Неверный формат файла. Разрешены только PDF.');
      return;
    }

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

      const response = await fetch(
        API_ENDPOINTS.upload,
        {
          method: 'POST',
          headers: adminFetchHeaders(),
          body: formData
        }
      );

      const result = await response.json();

      if (result.success && result.data?.url) {
        setProfile({ ...profile, cvUrl: result.data.url });
      } else {
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
          headers: adminHeaders(),
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
    <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5ea]/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-[28px] p-[48px]">
      <div className="flex items-center justify-between mb-[32px]">
        <h2 className="font-['SF_Pro',sans-serif] font-bold text-[#000000] text-[34px]">
          Настройки профиля
        </h2>
        <div className="flex gap-[12px]">
          <button
            type="submit"
            className="bg-[#007AFF] px-[24px] py-[12px] rounded-[100px] font-['SF_Pro',sans-serif] text-white text-[17px] hover:bg-[#0066DD] transition-colors shadow-[0_2px_12px_rgba(0,122,255,0.3)]"
          >
            Сохранить
          </button>
        </div>
      </div>

      <div>
        {/* Photo Section */}
        <div className="mb-[24px]">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[12px]">
            Фото профиля
          </label>

          {profile.photoUrl ? (
            <div className="relative rounded-[12px] overflow-hidden border border-[#e5e5ea] w-[280px] h-[280px]">
              <img
                src={profile.photoUrl}
                alt="Превью"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={() => updateField('photoUrl', '')}
                className="absolute top-[8px] right-[8px] p-[8px] bg-white/50 backdrop-blur-xl rounded-[8px] hover:bg-red-100/50 transition-colors"
              >
                <X className="size-[16px] text-red-500" />
              </button>
            </div>
          ) : (
            <label className="w-[280px] h-[280px] border-2 border-dashed border-[#d1d1d6] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] hover:border-[#007AFF]/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[#fafafa] hover:bg-[#f0f0f2]">
              <Upload className="size-[32px] text-[#6e6e73]" />
              <span className="text-[#000000] text-center px-[16px]">
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

          <p className="mt-[8px] text-[#6e6e73] text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
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
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[12px]">
            О себе
          </label>
          <textarea
            value={profile.about || ''}
            onChange={(e) => updateField('about', e.target.value)}
            placeholder="Введите информацию о себе"
            rows={4}
            className="w-[280px] px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all placeholder:text-[#6e6e73]/60"
          />
        </div>

        {/* Telegram URL */}
        <div className="mb-[24px]">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[12px]">
            Ссылка на Telegram
          </label>
          <input
            type="url"
            value={profile.telegramUrl || ''}
            onChange={(e) => updateField('telegramUrl', e.target.value)}
            placeholder="https://t.me/username"
            className="w-[280px] px-[16px] py-[12px] bg-[#f5f5f7] border border-[#e5e5ea] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all placeholder:text-[#6e6e73]/60"
          />
        </div>

        {/* CV Section */}
        <div className="mb-[24px]">
          <label className="block font-['SF_Pro',sans-serif] font-[590] text-[#000000] text-[17px] mb-[12px]">
            Резюме
          </label>

          {profile.cvUrl ? (
            <div className="flex items-center gap-[12px] p-[16px] border border-[#e5e5ea] rounded-[12px] bg-[#f5f5f7] w-fit">
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['SF_Pro',sans-serif] text-[#007AFF] text-[15px] underline max-w-[200px] truncate"
              >
                {profile.cvUrl.split('/').pop() || 'Резюме'}
              </a>
              <label className="cursor-pointer p-[8px] bg-[#f5f5f7] rounded-[8px] hover:bg-[#e5e5ea] transition-colors border border-[#e5e5ea]" title="Заменить">
                <Upload className="size-[16px] text-[#000000]" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleCVUpload}
                  disabled={uploadingCV}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => updateField('cvUrl', '')}
                className="p-[8px] bg-[#f5f5f7] rounded-[8px] hover:bg-red-50 transition-colors border border-[#e5e5ea]"
                title="Удалить"
              >
                <X className="size-[16px] text-red-500" />
              </button>
            </div>
          ) : (
            <label className="w-[280px] h-[120px] border-2 border-dashed border-[#d1d1d6] rounded-[12px] font-['SF_Pro',sans-serif] text-[17px] hover:border-[#007AFF]/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[#fafafa] hover:bg-[#f0f0f2]">
              <Upload className="size-[32px] text-[#6e6e73]" />
              <span className="text-[#000000] text-center px-[16px]">
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

          <p className="mt-[8px] text-[#6e6e73] text-[13px] font-['SF_Pro',sans-serif] max-w-[280px]">
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
